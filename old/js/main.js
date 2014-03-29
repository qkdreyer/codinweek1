var app = {


    initialize: function() {
        var self = this;
        this.store = new MemoryStore(function() {
            $('body').html(new HomeView(self.store).render().el);
        });
    },

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

};

this.changePicture = function(event) {
    /*event.preventDefault();
    if (!navigator.camera) {
        app.showAlert("Camera API not supported", "Error");
        return;
    }
    var options =   {   quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                        encodingType: 0     // 0=JPG 1=PNG
                    };
 
    navigator.camera.getPicture(
        function(imageData) {
            $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
        },
        function() {
            app.showAlert('Error taking picture', 'Error');
        },
        options);
 
    return false;*/

    event.preventDefault();
    console.log('addToContacts');
    if (!navigator.contacts) {
        app.showAlert("Contacts API not supported", "Error");
        return;
    }
    var contact = navigator.contacts.create();
    contact.name = {givenName: employee.firstName, familyName: employee.lastName};
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
    phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true); // preferred number
    contact.phoneNumbers = phoneNumbers;
    contact.save();
    return false;
};

app.initialize();