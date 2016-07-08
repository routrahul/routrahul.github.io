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

    $scope.startSpeech = function(){
      $scope.speechStart = true;
      recognition.start();
    }

    $scope.endSpeech = function(){
      recognition.stop();
      $scope.speechStart = false;
      alert($scope.final_transcript);
      return;
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
      //alert($scope.final_transcript);
      // if($scope.final_transcript)
      // {
      //   $scope.speech();
      // }
      // $scope.$apply();
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
      // alert($scope.interim_transcript);
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
