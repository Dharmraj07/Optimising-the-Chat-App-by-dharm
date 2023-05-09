const API_URL = "http://localhost:8000";
const token = localStorage.getItem('token');
const name = localStorage.getItem('username');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const messageForm = document.getElementById('send-container');
const socket = io(API_URL);

socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener('submit', async e => {
  let localmsg=JSON.parse(localStorage.getItem("message"));

  e.preventDefault();
  const message = messageInput.value;

  const response = await axios.post(
    `${API_URL}/chat`,{message},
    {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    },
);
 const userData=response.data;
 appendMessage(`${userData.username}: ${userData.message}`);
 let mergedMessages;
     if (localmsg) {
       // Deleting old messages
       if (localmsg.length >= 10) {
         localmsg.splice(0, 3);
       }
 
       mergedMessages = [...localmsg, userData];
     } else {
       mergedMessages = [userData];
     }
     //console.log(mergedMessages, lastmessageid, messages);
     localStorage.setItem("message", JSON.stringify(mergedMessages));

 console.log(userData);

  // const response = await fetch(`${API_URL}/chat`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify({ message }),
  // });

  const data =  response.data;
  console.log(data);
  socket.emit('send-chat-message', message);

  messageInput.value = '';
});

async function getMessages() {
  try {
      let localmsg=JSON.parse(localStorage.getItem("message"));
     
    // console.log(localmsg);

    if (localmsg) {
      allChatAppend(localmsg);
      console.log("by loc msg");

    } else {
      const response = await fetch(`${API_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      localStorage.setItem('message',JSON.stringify(data));
      allChatAppend(data);
    }
    
  } catch (error) {
    console.error(error);
  }
}

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function allChatAppend(data) {
  messageContainer.innerHTML = '';
  
  data.forEach(element => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<b>${element.username}:</b> ${element.message}`;
    messageContainer.append(messageElement);
  });
  messageContainer.scrollTop = messageContainer.scrollHeight;
  
}

// Call the API every 1 second
// setInterval(() => {
//   getMessages();
// }, 1000);

// Initial call to get all messages
getMessages();


// const API_URL = "http://localhost:8000";
// const token = localStorage.getItem('token');
// const name = localStorage.getItem('username');
// const messageContainer = document.getElementById('message-container');
// const messageInput = document.getElementById('message-input');
// const messageForm = document.getElementById('send-container');

// const socket = io(API_URL);

// socket.emit('new-user', name);

// socket.on('chat-message', data => {
//   appendMessage(`${data.name}: ${data.message}`);
// });

// socket.on('user-connected', name => {
//   appendMessage(`${name} connected`);
// });

// socket.on('user-disconnected', name => {
//   appendMessage(`${name} disconnected`);
// });

// messageForm.addEventListener('submit', async e => {
//   e.preventDefault();
//   const message = messageInput.value;

//   const response = await fetch(`${API_URL}/chat`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ message }),
//   });

//   const data = await response.json();
//  // appendMessage(`${name}: ${message}`);
//   socket.emit('send-chat-message', message);
//   messageInput.value = '';
// });

// async function getMessages() {
//   try {
//     const response = await fetch(`${API_URL}/chat`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const data = await response.json();
//     allChatAppend(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// function appendMessage(message) {
//   const messageElement = document.createElement('div');
//   messageElement.innerText = message;
//   messageContainer.append(messageElement);
// }

// function allChatAppend(data) {
//   messageContainer.innerHTML = '';
//   data.forEach(element => {
//     const messageElement = document.createElement('div');
//     messageElement.innerHTML = `<b>${element.username}:</b> ${element.message}`;
//     messageContainer.append(messageElement);
//   });
// }

// // Call the API every 1 second
// setInterval(() => {
//   getMessages();
// }, 1000);

// // Initial call to get all messages
// getMessages();

