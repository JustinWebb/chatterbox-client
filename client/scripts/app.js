
    var app = (function(){
      // Private variables
      var _vm = {
        chats: null,
        messages: null,
        currentRoom: null,
        rooms: null,
        submit: null,
        listLimit: 10,
        chatRooms: {},
        results:{}
      };
      // Public API
      return {

          server: 'https://api.parse.com/1/classes/chatterbox',

          init:function(){
            _vm.chats = $('#chats');
            _vm.rooms = $('#roomSelect');
            _vm.submit = $('#send .submit');

            _vm.chats.on('click', '.username', this.addFriend);
            _vm.submit.on('submit', this.handleSubmit);

            this.fetch();
          },

          addFriend: function(e){
            console.log(e);
          },

          clearMessages:function(){
            _vm.chats.children().remove();
          },

          addMessage : function (msg) {
            var item =  '<li class="chat">' +
                          '<p>'+
                            '<span class="username">' + msg.username + '</span>' +
                            '<span>' + msg.roomname + '</span>' +
                            '<span>' + msg.text + '</span>' +
                          '</p>' +
                        '</li>';
              _vm.chats.append(item);
          },
          addRoom : function (msg) {
            var item =  '<li>' +
                          // '<a>'+
                             msg +
                          // '</p>' +
                        '</li>';
              _vm.rooms.append(item);
          },

          handleSubmit: function(e){
            console.log(e);
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
          },

          fetch: function(){

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
                //console.error('chatterbox: Failed to send message')
                var liHtml = "";
                _.each(data.results, function(item, i, list){
                  if (!_vm.chatRooms[item.roomname]) {
                    var key = item.objectId;
                    _vm.chatRooms[item.roomname] = {key : item};
                  }
                  else if (!_vm.chatRooms[item.roomname][item.objectId]) {
                      _vm.chatRooms[item.roomname][item.objectId] = item;
                      console.log(_vm.chatRooms, i);
                  }

                  liHtml = '<li class="chat">' +
                              '<p class="userName">' + item.username + ' ' + item.roomname + '</p>' +
                              '<p>' + item.text + '</p>' +
                            '</li>';
                  //_vm.chats.children('li').remove();
                  _vm.chats.append(liHtml);
                });

              },
              error: function (data) {
                console.error('chatterbox: Failed to send message');
              }
            });
          }

        };
    })();

    // on load
    $(document).ready(function(){

      app.init();

    });


