(function () {
'use strict';

function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1, string.length);
}

function renderPokemonCard(pokemon) {
    return '<div class="card-item">\n            <img src="' + pokemon.image + '" width="64px" height="64px" />\n            <span class="card-item-title">' + capitalise(pokemon.name) + '</span>\n            <p class="card-item-subtitle">' + pokemon.type + '</p>\n        </div>';
}



function setContentTitle(title) {
    document.getElementById('content-title').innerText = title;
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

// Namespace shit
var Pokedex = function () {
    function Pokedex(app) {
        classCallCheck(this, Pokedex);

        this.pageCount = 1;
        this.increasePageCount = this.increasePageCount.bind(this);

        var button = document.querySelector('.search-button');
        button.addEventListener('click', this.requestPokemon.bind(this));
        setContentTitle(app.config.title);
    }

    createClass(Pokedex, [{
        key: 'insertPokemonToHtml',
        value: function insertPokemonToHtml(e) {
            var results = JSON.parse(e.currentTarget.response);
            var html = '';
            results.results.forEach(function (pokemon) {
                console.log(renderPokemonCard(pokemon));
                html += renderPokemonCard(pokemon);
            });
            document.querySelector('#results').innerHTML = html;
        }
    }, {
        key: 'increasePageCount',
        value: function increasePageCount() {
            this.pageCount++;
        }
    }, {
        key: 'requestPokemon',
        value: function requestPokemon() {
            var _this = this;

            var req = new XMLHttpRequest();
            req.addEventListener('load', function (e) {
                return _this.insertPokemonToHtml(e);
            });
            req.open("GET", app.config.baseUrl + 'pokemon');
            req.send();
        }
    }]);
    return Pokedex;
}();

function init(app) {
    new Pokedex(app);
}

var ctrls = [init];

var app$1 = window.app = {};
app$1.controllers = {};

app$1.config = {
    "name": "PokeDex",
    "baseUrl": "http://pokeapi.co/api/v2/",
    "title": "Pokemon"
};

ctrls.forEach(function (ctrl) {
    app$1.controllers[ctrl.name] = ctrl;
    app$1.controllers[ctrl.name](app$1);
});

}());
