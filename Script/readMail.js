var mailId;
var serverPath;
var user;
var domain;
var mailboxGuid;
var spinner;

var opts = { lines: 11, length: 7, width: 4, radius: 10, corners: 1, rotate: 0, color: '#000', speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: 10, left: 'auto' };

$(document).ready(function () {

    spinner = new Spinner(opts).spin(document.getElementById('loadingSpinner'));

    var startPath = getPath();
    var instanceName = getInstanceName();
    $.oneAgent.mail.setPath(startPath);
    $.oneAgent.mail.setInstanceName(instanceName);
    
    user = getUser();
    domain = getDomain();
    serverPath = getServerPath();
    mailId = getMailId();

    $('#Email').val(domain + "\\" + user);
    $('#ServerPath').val(serverPath);
    $('#loadingText').html('Getting Mailbox Information...');
    
    getMailboxGuid(serverPath, user, domain, mailId);
   
});

//-------------------------------------------------------------------------------
// Api Calls
//-------------------------------------------------------------------------------

function getMailboxGuid(serverPath, user, domain, mailId) {
    $.oneAgent.mail.getMailboxGuid({ 'ServerPath': serverPath, 'User': user, 'Domain': domain, 'MailID': mailId }, {
        success: function (data) {
            mailboxGuid = data.ID;

            if (!data.Authenticated) {
                spinner.stop();
                $('#loading').hide();
                $('#mainRowLogin').show();
            } else {
                getMail(mailboxGuid, mailId);
            }
        },
        error: function (data) {
            spinner.stop();
            $('#loadingText').html('Error on getting MailBox');
        }
    });
}

function setMailboxCredentials(mailboxGuid, password) {
    
    $('#loadingText').html('Setting Mailbox Credentials...');

    $.oneAgent.mail.setMailboxCredentials(mailboxGuid, password, {
        success: function (data) {
            getMail(mailboxGuid, mailId);
        },
        error: function (data) {
            spinner.stop();
            $('#loading').hide();
            $('#Passwd').parent().addClass('error');
            $('#mainRowLogin').show();
        }
    });
}

function getMail(mailboxGuid, mailId) {
    
    $('#loadingText').html('Getting Mail Information...');

    $.oneAgent.mail.getMail(mailboxGuid, mailId, {
        success: function (mail) {

            $('#emailSubject').html(mail.Subject);

            addFrom(mail.From);
            addTo(mail.To);
            addCc(mail.Cc);

            addSentDate(mail.DateSent);

            addBody(mail.Body);
            addAttachments(mail.Attachments);

            spinner.stop();
            $('#loading').hide();
            $('#mainRowMail').show();

            setTopandButtonSizes();
        },
        error: function (data) {
            spinner.stop();
            $('#loadingText').html('No E-mail Found');
        }
    });
}


//-------------------------------------------------------------------------------
// Interface Operations
//-----------------------------------------------------------------------------


function addFrom(from) {
    if (from.DisplayName != null) {
        if (validateEmail(from.Address)) {
            $('#emailFrom').append('<h5 class="address withTitle" title="' + from.Address + '">' + from.DisplayName + '</h5>');
        } else {
            $('#emailFrom').append('<h5 class="address">' + from.DisplayName + '</h5>');
        }    
    } else {
        $('#emailFrom').append('<h5 class="address">' + from.Address + '</h5>');
    }
    
}

function addTo(to) {
    
    if (null != to) {
        for (var i = 0; i < to.length; i++) {
            if (to[i].DisplayName != null) {
                if (validateEmail(to[i].Address)) {
                    $('#emailTo').append('<h5 class="address withTitle" title="' + to[i].Address + '">' + to[i].DisplayName + '</h5>');
                } else {
                    $('#emailTo').append('<h5 class="address">' + to[i].DisplayName + '</h5>');
                }
            } else {
                $('#emailTo').append('<h5 class="address">' + to[i].Address + '</h5>');
            }
        }

        if (to.length > 1) {
            var h5 = $('#emailTo').find('h5');
            for (var i = 0; i < h5.length - 1; i++) {
                $(h5[i]).append(';');
            }
        }
    }
    
}

function addCc(cc) {

    if (null != cc) {
        for (var i = 0; i < cc.length; i++) {
            if (cc[i].DisplayName != null) {
                if (validateEmail(cc[i].Address)) {
                    $('#emailCc').append('<h5 class="address withTitle" title="' + cc[i].Address + '">' + cc[i].DisplayName + '</h5>');
                } else {
                    $('#emailCc').append('<h5 class="address">' + cc[i].DisplayName + '</h5>');
                }
            } else {
                $('#emailCc').append('<h5 class="address">' + cc[i].Address + '</h5>');
            }
        }

        if (cc.length > 1) {
            var h5 = $('#emailCc').find('h5');
            for (var i = 0; i < h5.length - 1; i++) {
                $(h5[i]).append(';');
            }
        }
    }

}

function addSentDate(date) {

    date = new Date(date);

    var newdate = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);

    var day;
    var month;
    var year = newdate.getFullYear();
    var hours;
    var minutes;

    newdate.getDate() < 10 ? day = '0' + newdate.getDate() : day = newdate.getDate();
    (newdate.getMonth() + 1) < 10 ? month = '0' + (newdate.getMonth() + 1) : month = newdate.getMonth() + 1;
    newdate.getHours() < 10 ? hours = '0' + newdate.getHours() : hours = newdate.getHours();
    newdate.getMinutes() < 10 ? minutes = '0' + newdate.getMinutes() : minutes = newdate.getMinutes();
    
    $('#emailDate').html(day + '-' + month + '-' + year + ' ' + hours + ':' + minutes);
}

function addBody(body) {

    var bodySplit = body.split('src="cid:');

    if (bodySplit.length > 1) {
        for (var i = 1; i < bodySplit.length; i++) {
            var change = bodySplit[i].split('"')[0];
            var trueUrl = $.oneAgent.mail.getAttachmentUrl(mailboxGuid, mailId, change);
            body = body.replace("cid:" + change, trueUrl);
        }
    }

    $('#emailBody').html(body);
}

function addAttachments(attachments) {
    
    if (attachments != null) {
        if (attachments.length > 0) {
            $('#emailAttachment').show();
            for (var i = 0; i < attachments.length; i++) {

                var size = attachments[i].FileSize / 1024;
                var sizeString;

                if (size > 1024) {
                    size /= 1024;
                    sizeString = size.toFixed(2) + ' Mb ';
                } else {
                    sizeString = size.toFixed(2) + ' Kb ';
                }

                var attachmentDiv = document.createElement('div');
                attachmentDiv.className = 'attachment';
                var attachmentName = document.createElement('b');
                attachmentName.innerHTML = attachments[i].DisplayName;
                var attachmentSize = document.createElement('text');
                attachmentSize.innerHTML = sizeString;
                var attachmentDownload = document.createElement('a');
                var trueUrl = $.oneAgent.mail.getAttachmentUrl(mailboxGuid, mailId, attachments[i].ID);
                attachmentDownload.href = trueUrl;
                attachmentDownload.target = '_blank';
                attachmentDownload.innerHTML = 'Download';
                attachmentDiv.appendChild(attachmentName);
                attachmentDiv.appendChild(attachmentSize);
                attachmentDiv.appendChild(attachmentDownload);

                $('#emailAttachment').append(attachmentDiv);
            }

        }
    }

}

function setTopandButtonSizes() {
    $('#emailInfo').css('margin-top', $('#emailSubjectContainer').height());
    $('#emailBody').css('margin-bottom', $('#emailAttachment').height());
    $('#emailAttachmentHS').css('bottom', $('#emailAttachment').height());
}

$('#Passwd').on('keyup', function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        $('#signIn').trigger('click');
    }
});


$('#signIn').on('click', function () {
    $('#mainRowLogin').hide();
    $('#loading').show();
    spinner = new Spinner(opts).spin(document.getElementById('loadingSpinner'));
    user = $('#Passwd').val();
    setMailboxCredentials(mailboxGuid, user);
});

$('#emailAttachmentHS').on('click', function () {
    
    if ($('.attachment').is(':visible')) {
        $('.attachment').hide();
        $('#emailAttachmentHS').html('<i class="icon-file"></i>Show');
    } else {
        $('.attachment').show();
        $('#emailAttachmentHS').html('<i class="icon-file"></i>Hide');
    }
    
    $('#emailBody').css('margin-bottom', $('#emailAttachment').height());
    $('#emailAttachmentHS').css('bottom', $('#emailAttachment').height());
});

//-------------------------------------------------------------------------------
// Aux Operations
//-----------------------------------------------------------------------------

function validateEmail(email) {
    var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;

    if (!(email.search(emailRegEx) == -1)) {
        return true;
    }

    return false;
}


$(window).resize(function() {
    setTopandButtonSizes();
});
