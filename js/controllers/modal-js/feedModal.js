app.controller('FeedModalController', [ '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
    
    if(!$rootScope.isEdititem){
        $rootScope.formData = {};
        $rootScope.formData.type = 1;
    }
    $rootScope.errorData = {};

    $rootScope.inputchange = function() {
        $rootScope.errorData = {};
        $rootScope.seterrorMsg();
    }

    $rootScope.seterrorMsg = function(){
        $rootScope.errorData.content_errorMsg = 'Please enter content';
    }

    $rootScope.setservererrorMsg = function(errors){
        $rootScope.errorData = {};
        angular.forEach(errors, function(error, no) {
            $rootScope.errorData[no.replace('new','')+'_errorMsg'] = error[0];
            $rootScope.errorData[no.replace('new','')+'_error'] = true;
        });
    }

    $rootScope.uploadCover = function(files) {
        $rootScope.errors = [];
        if (files && files.length) {
            var extn = files[0].name.split(".").pop();
            if ($rootScope.imgextensions.includes(extn.toLowerCase())) {
                if (files[0].size <= $rootScope.maxUploadsize) {
                    $rootScope.formData.newcover = files[0];
                } else {
                    $rootScope.errors.push(files[0].name + ' size exceeds.')
                }
            } else {
                $rootScope.errors.push(files[0].name + ' format unsupported.');
            }
        }
        if ($rootScope.errors.length > 0) {
            $rootScope.$emit("showErrors", $rootScope.errors);
        }
    }

    $rootScope.uploadDoc = function (files) {
        $rootScope.formData.newdocument = files[0];
    }

    $rootScope.addData = function(form) {
        $rootScope.seterrorMsg();
        if (form.$valid) {
            $rootScope.loading = true;
            if($rootScope.isEdititem){
                webServices.putupload('feed/'+$rootScope.formData.id, $rootScope.formData).then(function(getData) {
                    $rootScope.loading = false;
                    if (getData.status == 200) {
                        $rootScope.$emit("showSuccessMsg", getData.data.message);
                        $rootScope.closeModalPopup();
                        $state.reload();
                    } else if (getData.status == 401) {
                        $rootScope.setservererrorMsg(getData.data.message);
                        $rootScope.loading = false;
                    } else {
                        $rootScope.$emit("showISError", getData);
                    }
                });
            }else{
                webServices.upload('feed', $rootScope.formData).then(function(getData) {
                    $rootScope.loading = false;
                    if (getData.status == 200) {
                        $rootScope.$emit("showSuccessMsg", getData.data.message);
                        $rootScope.closeModalPopup();
                        $state.reload();
                    } else if (getData.status == 401) {
                        $rootScope.setservererrorMsg(getData.data.message);
                        $rootScope.loading = false;
                    } else {
                        $rootScope.$emit("showISError", getData);
                    }
                });
            }
        } else {
            if (!form.content.$valid) {
                $rootScope.errorData.content_error = true;
            } if (!form.video_link.$valid) {
                $rootScope.errorData.video_link_error = true;
            } 
            $rootScope.$emit("showErrors", $rootScope.errors);
        }
    }
    
}]);