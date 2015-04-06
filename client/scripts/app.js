
var app = (function(){
  // Private variables
  var _vm = {
    chats: null,
    messages: null
  };
  // Public API
  return {
      results:[],

      server: 'https://api.parse.com/1/classes/chatterbox',

      init:function(){

        console.log();
        _vm.chats = $('#chats');
        _vm.messages = $('#messages');
      },

      clearMessages:function(){
        _vm.chats.children().remove();
      },

      addMessage : function (msg) {
      // var message = {
      //   username: 'Mel Brooks',
      //   text: 'Never underestimate the power of the Schwartz!',
      //   roomname: 'lobby'
      // };
      var item =  '<li class="chat">' +
                    '<p>'+
                      '<span class="userName">' + msg.username + '</span>' +
                      '<span>' + msg.roomname + '</span>' +
                      '<span>' + msg.text + '</span>' +
                    '</p>' +
                  '</li>';
        _vm.chats.append(item);
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
             limit: 10
             // count: 1
             // include: "something"
          },
          contentType: 'application/json',
          //dataType:'jsonp',
          success: function (data) {
            //console.error('chatterbox: Failed to send message');
            // ourData

            _.each(data.results, function(item){
              _vm.messages.children('li').remove();
              _vm.messages.append('<li class="chat">' +
                                      '<p class="userName">' + item.username + ' ' + item.roomname + '</p>'
                                      + '<p>' + item.text + '</p>'


                                    +'</li>');
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
// $(function(){
//   $('#submitMessage').click(function(e){

//     e.preventDefault();
//     var message = {
//       'username': 'jyeg',
//       'text': $('#messageText').val(),
//       'roomname': 'kings_landing'
//     };

//     $.ajax({
//       // always use this url
//       url: 'https://api.parse.com/1/classes/chatterbox',
//       type: 'POST',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Message sent' + message);
//       },
//       error: function (data) {
//         // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message');
//       }
//     });
//   });

//   //setInterval(refresh, 1000);
// });


