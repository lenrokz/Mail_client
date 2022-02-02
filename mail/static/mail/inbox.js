document.addEventListener('DOMContentLoaded', function() {

// Use buttons to toggle between views
document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
document.querySelector('#compose').addEventListener('click', compose_email);

// By default, load the inbox
load_mailbox('inbox');
});

function compose_email() {

// Show compose view and hide other views
document.querySelector('#emails-view').style.display = 'none';
document.querySelector('#compose-view').style.display = 'block';
document.querySelector('#email-view').style.display = 'none';

// Clear out composition fields
document.querySelector('#compose-recipients').value = '';
document.querySelector('#compose-subject').value = '';
document.querySelector('#compose-body').value = '';
document .querySelector("#compose-form")

document.querySelector("#compose-form").addEventListener("submit", send_mail);

}
function send_mail() {
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
  recipients: document.querySelector('#compose-recipients').value,
  subject: document.querySelector('#compose-subject').value,
  body: document.querySelector('#compose-body').value
  })
  })
  .then(response => response.json())
  .then(result => {
  load_mailbox('sent');
  });
}

function load_mailbox(mailbox) {
// Show the mailbox and hide other views
document.querySelector('#emails-view').style.display = 'block';
document.querySelector('#compose-view').style.display = 'none';
document.querySelector('#email-view').style.display = 'none';

// Show the mailbox name
document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
// Print emails
for (const element of emails) {
  const preview_email = document.createElement("div");
  preview_email.innerHTML =
    `
    <div id="element" style="border-style: solid; height: 110px;">
    <p>Sender: ${element["sender"]}</p>
    <p>Subject: ${element["subject"]}</p>
    <p>${element["timestamp"]}</p>
    </div>
    <br>
    `;
preview_email.addEventListener('click', function() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#email-view').innerHTML = "";
      fetch(`/emails/${element["id"]}`, {
      method: 'PUT',
      body: JSON.stringify({
      read: true
      })
      })
      fetch(`/emails/${element["id"]}`)
      .then(response => response.json())
      .then(email => {
      let single_mail = document.createElement("div");
      if(mailbox == "sent") {
      single_mail.innerHTML =
      `
      <div>
      <p><b>From:</b> ${element["sender"]}</p>
      <p><b>To:</b> ${element["recipients"]}</p>
      <p><b>Subject:</b> ${element["subject"]}</p>
      <p><b>Timestamp:</b> ${element["timestamp"]}</p>
      <p>${element["body"]}</p>

      </div>
      `;
      } else if (mailbox == "archive") {
      single_mail.innerHTML =
      `
      <div>
      <p><b>From:</b> ${element["sender"]}</p>
      <p><b>To:</b> ${element["recipients"]}</p>
      <p><b>Subject:</b> ${element["subject"]}</p>
      <p><b>Timestamp:</b> ${element["timestamp"]}</p>
      <button id="archive" class="btn btn-sm btn-outline-primary">Unarchive</button>
      <p>${element["body"]}</p>

      </div>
      `;
      } else {
      single_mail.innerHTML =
      `
      <div>
      <p><b>From:</b> ${element["sender"]}</p>
      <p><b>To:</b> ${element["recipients"]}</p>
      <p><b>Subject:</b> ${element["subject"]}</p>
      <p><b>Timestamp:</b> ${element["timestamp"]}</p>
      <button id="reply" class="btn btn-sm btn-outline-primary">Reply</button>
      <button id="archive" class="btn btn-sm btn-outline-primary">Archive</button>
      <p>${element["body"]}</p>

      </div>
      `;
      }
single_mail.addEventListener('click',function(e){
if(mailbox == "archive") {
  if(e.target && e.target.id == 'archive'){
    fetch(`/emails/${element["id"]}`, {
    method: 'PUT',
    body: JSON.stringify({
    archived: false
    })
    })
    load_mailbox('inbox');
    }

    } else {
    if(e.target && e.target.id== 'archive'){
    fetch(`/emails/${element["id"]}`, {
    method: 'PUT',
    body: JSON.stringify({
    archived: true
    })
    })
    load_mailbox('inbox');
    }

}

}); 
single_mail.addEventListener('click',function(f){
  if(f.target && f.target.id == 'reply'){
document.querySelector('#emails-view').style.display = 'none';
document.querySelector('#compose-view').style.display = 'block';
document.querySelector('#email-view').style.display = 'none';
document.querySelector('#compose-recipients').value = element["sender"];
document.querySelector('#compose-subject').value ="Re: " + element["subject"];
document.querySelector('#compose-body').value = "On " + element["timestamp"] + " " + element["sender"]  + " wrote: " + element["body"];
}
});
document.querySelector("#email-view").append(single_mail);
});
});
if (!element["read"]) {
  preview_email.style.backgroundColor ="#A8A8A8"
}
  document.querySelector("#emails-view").append(preview_email);
}

});

}