'use strict';

angular.module('stm.notes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/notes', { templateUrl: 'views/notes/notes.html', controller: 'NoteCtrl' })
}])


.controller('NoteCtrl',['$scope','$location','$http','ActionFactory','$interval',
  function($scope,$location,$http,ActionFactory,$interval){

    $scope.speechStart = false;
    $scope.interim_transcript = '',$scope.final_transcript = '';

    $scope.save = function(){
      $location.path("/landing");
    }

    $scope.speech = function(){
      if($scope.speechStart)
      {
        recognition.stop();
        $scope.speechStart = false;
        return;
      }else{
        $scope.speechStart = true;
        recognition.start();
      }

    }

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      // recognizing = true;
      // showInfo('info_speak_now');
      // start_img.src = 'mic-animate.gif';
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        // start_img.src = 'mic.gif';
        // showInfo('info_no_speech');
        // ignore_onend = true;
        console.log(event);
      }
      if (event.error == 'audio-capture') {
        // start_img.src = 'mic.gif';
        // showInfo('info_no_microphone');
        // ignore_onend = true;
        console.log(event);
      }
      if (event.error == 'not-allowed') {
        // if (event.timeStamp - start_timestamp < 100) {
        //   showInfo('info_blocked');
        // } else {
        //   showInfo('info_denied');
        // }
        // ignore_onend = true;
        console.log(event);
      }
    };

    recognition.onend = function() {
      if($scope.final_transcript)
      {
        console.log($scope.final_transcript);
        $scope.speech();
      }
      // recognizing = false;
      // if (ignore_onend) {
      //   return;
      // }
      // start_img.src = 'mic.gif';
      // if (!final_transcript) {
      //   showInfo('info_start');
      //   return;
      // }
      // showInfo('');
      // if (window.getSelection) {
      //   window.getSelection().removeAllRanges();
      //   var range = document.createRange();
      //   range.selectNode(document.getElementById('final_span'));
      //   window.getSelection().addRange(range);
      // }
      // if (create_email) {
      //   create_email = false;
      //   createEmail();
      // }
      // console.log(event);
    };

    recognition.onresult = function(event) {
      // console.log(event.results[i][0].transcript);

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          $scope.final_transcript += event.results[i][0].transcript;
        } else {
          $scope.interim_transcript += event.results[i][0].transcript;
        }
      }
      $scope.final_transcript = $scope.interim_transcript;
      $scope.$apply();
      // $scope.final_transcript = capitalize(final_transcript);
      // final_transcript = capitalize(final_transcript);
      // final_span.innerHTML = linebreak(final_transcript);
      // interim_span.innerHTML = linebreak(interim_transcript);
      // if (final_transcript || interim_transcript) {
      //   showButtons('inline-block');
      // }
    };

}])
