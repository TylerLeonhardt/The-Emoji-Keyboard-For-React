var pluginName = "emojiPicker",
      defaults = {
        width: '200',
        height: '350',
        position: 'right',
        fadeTime: 100,
        iconColor: 'black',
        iconBackgroundColor: '#eee',
        container: 'body',
        button: true
      };

  var MIN_WIDTH = 200,
      MAX_WIDTH = 600,
      MIN_HEIGHT = 100,
      MAX_HEIGHT = 350,
      MAX_ICON_HEIGHT = 50;



/* ---------------------------------------------------------------------- */

  var EmojiKeyboard = React.createClass({
    getActiveClass: function(i) {
      return i == this.state.section ? "tab active" : "tab";
    },
    getHiddenClass: function(category, i) {
      return i == 0 ? category.name : category.name + " hidden";
    },
    getInnerClass: function(symbol){
      return "emoji emoji-" + symbol;
    },
    getInitialState : function() {
      return {
        section : 0,
        current : ""
      };
    },
    handleTabClick: function(i){
      this.setState({section:i, current:""});
    },
    handleEmojiClick: function(e){
      var emojiShortcode = e.target.className.split('emoji-')[1];
      var emojiUnicode = toUnicode(findEmoji(emojiShortcode).unicode);

      this.setState({section:this.state.section, current:emojiUnicode});
    },
    render: function() {
console.log(this.state.section + " " + this.state.current);
      var tabs = this.props.categories.map(function (category, i) {

        return (
          <div onClick={this.handleTabClick.bind(this, i)} className={this.getActiveClass(i)} data-tab={category.name}><div className={this.getInnerClass(category.symbol)}></div></div>
        );
      }, this);

      var sections = this.props.categories.map(function (category, i) {
        var emojis = this.props.items[ category.name ].map(function(item, j){
          // var emoji = this.this.props.items[ category.name ][ j ];
          var theClass = "emoji emoji-" + item.shortcode;
          return (
            <div onClick={this.handleEmojiClick} className={theClass}></div>
          );
        }.bind(this));
        return (
          <section>
            {emojis}
          </section>
        );
      }, this);

      return (
        <div className="emoji-keyboard">
          <nav>
            {tabs}
          </nav>
          {sections[this.state.section]}
        </div>
      );
    }
  });

  ReactDOM.render(
    <EmojiKeyboard categories={getCats()} items={getItems()}/>,
    document.getElementById('content')
  );

  function getCats() {
    var categories = [
      { "name": "emotion",  "symbol": 'grinning' },
      { "name": "animal",   "symbol": 'whale' },
      { "name": "food",     "symbol": 'hamburger' },
      { "name": "folderol", "symbol": 'sunny' },
      { "name": "thing",    "symbol": 'kiss' },
      { "name": "travel",   "symbol": 'rocket' }
    ];

    return categories;
  }

  function getItems() {
    var aliases = {
      'people':    'emotion',
      'symbol':    'thing',
      'undefined': 'thing'
    };

    var items = {};

    for(var i = 0; i < window.emojiGoogle.length; i++){
      var category = aliases[ window.emojiGoogle[i].category ] || window.emojiGoogle[i].category;
      items[ category ] = items[ category ] || [];
      items[ category ].push( window.emojiGoogle[i] );
    }
    return items;
  };

  function findEmoji(emojiShortcode) {
    var emojis = window.emojiGoogle;
    for (var i = 0; i < emojis.length; i++) {
      if (emojis[i].shortcode == emojiShortcode) {
        return emojis[i];
      }
    }
  }

  function insertAtCaret(inputField, myValue) {
    if (document.selection) {
      //For browsers like Internet Explorer
      inputField.focus();
      var sel = document.selection.createRange();
      sel.text = myValue;
      inputField.focus();
    }
    else if (inputField.selectionStart || inputField.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = inputField.selectionStart;
      var endPos = inputField.selectionEnd;
      var scrollTop = inputField.scrollTop;
      inputField.value = inputField.value.substring(0, startPos)+myValue+inputField.value.substring(endPos,inputField.value.length);
      inputField.focus();
      inputField.selectionStart = startPos + myValue.length;
      inputField.selectionEnd = startPos + myValue.length;
      inputField.scrollTop = scrollTop;
    } else {
      inputField.focus();
      inputField.value += myValue;
    }
  }

  function toUnicode(code) {
    var codes = code.split('-').map(function(value, index) {
      return parseInt(value, 16);
    });
    return String.fromCodePoint.apply(null, codes);
  }

  if (!String.fromCodePoint) {
    // ES6 Unicode Shims 0.1 , © 2012 Steven Levithan http://slevithan.com/ , MIT License
    String.fromCodePoint = function fromCodePoint () {
        var chars = [], point, offset, units, i;
        for (i = 0; i < arguments.length; ++i) {
            point = arguments[i];
            offset = point - 0x10000;
            units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
            chars.push(String.fromCharCode.apply(null, units));
        }
        return chars.join("");
    }
  }

  /*****************************************************/
