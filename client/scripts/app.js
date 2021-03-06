
    var app = (function(){
      // Private variables
      var _vm = {
        $chats: null,
        //$messages: null,
        $rooms: null,
        $submit: null,
        currentUser: null,
        currentRoom: null,
        listLimit: 100,
        chatRooms: {},
        results:{}
      };
      // Public API
      return {

          server: 'https://api.parse.com/1/classes/chatterbox',

          init:function(){
            _vm.$chats = $('#chats');
            _vm.$rooms = $('#roomSelect');
            _vm.$form = $('#send');
            _vm.$input = $('#message');

            _vm.$chats.on('click', '.username', this.addFriend);
            _vm.$form.on('submit', this.handleSubmit.bind(this));
            _vm.$rooms.on('click', 'a', this.changeRoom.bind(this));

            _vm.currentUser = (prompt('What is your name?') || 'anonymous');
            //window.location.search += '&username=' + _vm.currentUser;

            // this.buildChatRooms.bind(this);
            this.fetch();
          },

          addFriend: function(e){
            console.log(e);
          },

          clearMessages:function(){
            _vm.$chats.children().remove();
          },

          addMessage : function (msg) {
            var item =  '<li class="chat">' +
                          '<p>'+
                            '<span class="username">' + msg.username + '</span>' +
                            '<span>' + msg.roomname + '</span>' +
                            '<span>' + msg.text + '</span>' +
                          '</p>' +
                        '</li>';
              _vm.$chats.append(item);
          },
          addRoom : function (msg) {
            var item =  '<li>' +
                          // '<a>'+
                             msg +
                          // '</p>' +
                        '</li>';
              _vm.$rooms.append(item);
          },

          changeRoom: function(e){

            _vm.currentRoom = e.target.id;
            this.buildChatRoom();
          },

          handleSubmit: function(e){
            e.preventDefault();
            console.log(e);
            var input = _.escape(_vm.$input.val());
            var message = {
              'username': window.location.search.split("=")[2],
              'text': input,
              'roomname': _vm.currentRoom
            };
            this.send(message);

          },

          send:function(input){
            $.ajax({
              // always use this url
              url: 'https://api.parse.com/1/classes/chatterbox',
              type: 'POST',
              data: JSON.stringify(input),
              contentType: 'application/json',
              success: function (data) {
                console.log('chatterbox: Message sent' + message);
              },
              error: function (data) {
                // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
                console.error('chatterbox: Failed to send message');
              }
            });
            this.fetch();
          },

          buildChatRoom:function(){
            var liHtml = "";
            _vm.$chats.children('li').remove();
            if(!_vm.currentRoom){
              _.each(_vm.chatRooms, function(room){
                _.each(room, function(item, i, list){
                liHtml = '<li class="chat">' +
                            '<p class="userName">' + item.username + ' ' + item.roomname + '</p>' +
                            '<p>' + item.text + '</p>' +
                          '</li>';
                _vm.$chats.append(liHtml);
                });
              });
            }else{
              _.each(_vm.chatRooms[_vm.currentRoom], function(item, i, list){
                liHtml = '<li class="chat">' +
                            '<p class="userName">' + item.username + ' ' + item.roomname + '</p>' +
                            '<p>' + item.text + '</p>' +
                          '</li>';
                //_vm.$chats.children('li').remove();
                _vm.$chats.append(liHtml);
              });
            }
          },

          fetch: function(){
            var chatBuilder = this.buildChatRoom;
            $.ajax({
              // always use this url
              url: this.server,
              type: 'GET',
              data: /*{'order=-createdAt', 'limit=10'}*/
              {
                 order:'-createdAt',
                 limit: _vm.listLimit
                 // where:{roomname!=}
                 // count: 1
                 // include: "something"
              },
              contentType: 'application/json',
              //dataType:'jsonp',
              success: function (data) {
                var liHtml = "";
                _.each(data.results, function(item, i, list){
                  // build chatRooms obj
                  item.text = _.escape(item.text);
                  item.roomname = _.escape(item.roomname);
                  if (!_vm.chatRooms[item.roomname]) {
                    var key = item.objectId;
                    _vm.chatRooms[item.roomname] = {key : item};
                  }
                  else if (!_vm.chatRooms[item.roomname][item.objectId]) {
                      _vm.chatRooms[item.roomname][item.objectId] = item;
                      //console.log(_vm.chatRooms, i);
                  }
                });
                // populate the list of rooms available
                // use add room function.
                var liRooms = "";
                var rooms = Object.keys(_vm.chatRooms);

                _.each(rooms, function(ele, index, list){
                  liRooms = '<li>' +
                              '<a href="#" id="'+ ele +'">' + ele + '</a>' +
                            '</li>';
                  //_vm.$chats.children('li').remove();
                  _vm.$rooms.append(liRooms);
                });
                // separated the fetch method that populates our chat room hash from the build chat room messages feature.
                chatBuilder();
              },
              error: function (data) {
                console.error('chatterbox: Failed to send message');
              }
            });
            // this.buildChatRoom.bind(this);

          }

        };
    })();

    // on load
    $(document).ready(function(){

      app.init();

    });


