
var reg;
var sub;
var isSubscribed = false;
var subscriptionId;
var subscribeButton = document.getElementById('subscribe');
var sendQueryButton = document.getElementById('sendMessage');
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    subscribeButton.disabled = false;
    console.log('Service Worker is ready :^)', reg);
    subscribe();
  }).catch(function(error) {
    console.log(error);
  });
}
subscribeButton.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});
// sendQueryButton.addEventListener('click', function() {
//
//   $.ajax({
//     type: "POST",
//     url: "https://android.googleapis.com/gcm/send",
//     beforeSend: function (xhr) {
//                 /* Authorization header */
//                 xhr.setRequestHeader("Authorization", "key=AIzaSyCH44qhsh-Bv26-nAk8WH0Uyp-isoWkWY4");
//                 xhr.setRequestHeader("Content-Type", "application/json");
//             },
//     data: JSON.stringify({
//         registration_ids: [subscriptionId] // eslint-disable-line camelcase
//     })
//   });
// });
function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription){
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    $("#sendMessage").show();
    $(subscribeButton).removeClass("btn-danger").addClass("btn-success")
    subscriptionId = sub.endpoint.split("/")[sub.endpoint.split("/").length - 1]
    //subscribeButton.textContent = 'Unsubscribe';
    isSubscribed = true;
    initiateMessages();
  }).catch(function(ex){
    alert(ex);
    $(".output").html(ex.toString());
  });;
}
function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Subscribe';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
    $(subscribeButton).removeClass("btn-success").addClass("btn-danger")
  }).catch(function(error) {
    alert(error);
    console.log('Error unsubscribing', error);
    //subscribeButton.textContent = 'Subscribe';
  });
}

function openNotes(){
  location.replace('/stm/index.html#/notes');
}
