importPackage(javax.mail);
importPackage(javax.mail.internet);
var email = {
    send: function(from, to, subject, msgBody) {
        var props = new Properties();
        var session = Session.getDefaultInstance(props, null);

        var msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(from.address, from.personal));
        msg.addRecipient(Message.RecipientType.TO,
                         new InternetAddress(to.address, to.personal));
        msg.setSubject(subject);
        msg.setText(msgBody);
        Transport.send(msg);
    }
};
exports = email;
