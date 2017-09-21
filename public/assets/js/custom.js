
(function(){
	var turbo = Turbo({
		site_id: '59a8f656b1544b0011950a9a'
	})
	var upload = null

	$('.btn-upload').click(function(event){
		event.preventDefault()
		turbo.uploadFile(function(err, data){
			if (err){
				alert('Error:' + err.message)
				return
			}
			var file = data.result
			$.ajax({
				method: 'POST',
				url: '/upload',
				data: {file: file, upload: 'track'},
				success: function(data){
					console.log(data)
					location.reload()
				}
			})
		})
	})

	$('#profile-icon').click(function(event){

		event.preventDefault()
		turbo.uploadFile(function(err, data){
			if (err){
				alert('Error:' + err.message)
				return
			}
			var file = data.result
			$.ajax({
				method: 'POST',
				url: '/upload',
				data: {file: file, upload: 'image'},
				success: function(data){
					console.log(data)
					location.reload()
				}
			})
		})
	})
	
	$('.channel').click(function(event){
		event.preventDefault()
		var id = $(this).attr('id')

		$.ajax({
			method: 'GET',
			url: `user/${id}`,
			success: function(data){
				var tracks = data.result[0].tracks
				if(tracks.length == 0)
					return
				var playlist = []
				tracks.forEach(function(track){
					playlist.push({
						title: track.name,
						author: '',
						url: track.url,
						pic: ''
					})
				})



				configureAudioPlayer(playlist)
			}
		})

	})

	$('.sign-in').on('click', function(e){
		e.preventDefault()
		$('.playlist').toggleClass('show')

	})

	var configureAudioPlayer = function(tracks){
		if(tracks === null)
			return
		var ap4 = new APlayer({
			element: document.getElementById('aplayer'),
			narrow: false,
			autoplay: false,
			showlrc: false,
			mutex: true,
			theme: '#ad7a86',
			mode: 'random',
			music: tracks
		});
	}



})()