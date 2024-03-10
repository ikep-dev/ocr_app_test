const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const resultInput = document.getElementById('result');
const saveButton = document.getElementById('data_save');

// カメラを起動
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        video.srcObject = stream;
    })
    .catch(function(err) {
        resultInput.value = "エラーが発生しました: " + err;
    });

// 画像をキャプチャする
captureButton.addEventListener('click', function() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    canvas.toBlob(function(blob) {
        // 画像をサーバーへ送信
        sendImage(blob);
    });
});

// 画像をサーバーへ送信する関数
function sendImage(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob);

    // CSRFトークン取得
    const csrftoken = getCookie('csrftoken');

    fetch('/upload/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text.trim());
            if (data && data.text) {
                resultInput.value = data.text;
            } else {
                resultInput.value = '無効なJSON形式または「text」フィールドがありません。';
            }
        } catch (error) {
            resultInput.value = 'JSONの解析エラー:', error;
        }
    })
    .catch(error => {
        resultInput.value = 'エラー:', error;
    });
}

// データをデータベースに保存する
saveButton.addEventListener('click', function() {
    const data = resultInput.value.trim();
    // データが空でなければ送信
    if (data) {
        uploadText(data);
    } else {
        alert('データがありません！再度キャプチャしてください。');
    }
});

// テキストデータをサーバーにアップロードする機能
function uploadText(text) {
    fetch('/save/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => {
        if (response.ok) {
            alert('保存完了！');
        } else {
            alert('保存失敗！');
        }
    })
    .catch(error => {
        alert('保存失敗！\nError:'+error);
    });
}

// CookieからCSRFトークンを取得する関数
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
