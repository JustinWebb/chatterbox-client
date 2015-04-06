// YOUR CODE HERE:


// on load
$(function(){
	$('#submitMessage').click(function(e){

		e.preventDefault();
		var message = {
			'username': 'jyeg',
			'text': $('#messageText').val(),
			'roomname': 'kings_landing'
		};

		$.ajax({
			// always use this url
			url: 'https://api.parse.com/1/classes/chatterbox',
			type: 'POST',
			data: JSON.stringify(message),
			contentType: 'application/json',
			success: function (data) {
				console.log('chatterbox: Message sent' + message);
			},
			error: function (data) {
				// see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
				console.error('chatterbox: Failed to send message');
			}
		});
	});
	var refresh = function(){

		$.ajax({
			// always use this url
			url: 'https://api.parse.com/1/classes/chatterbox',
			type: 'GET',
			data: 'order=-createdAt',
			contentType: 'application/json',
			//dataType:'jsonp',
			success: function (data) {
				console.error('chatterbox: Failed to send message');
				_.each(data.results, function(item){
					$('#messages').append('<li class="chat">' +
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
	setInterval(refresh(), 200);
});


