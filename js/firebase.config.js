const FirebaseDB = (function () {
    'use strict';

    firebase.initializeApp({
        apiKey: 'AIzaSyCvRFbyHK_tXEUWbXKx9uqOzM9HLdrrlAE',
        authDomain: 'blowinglightgame.firebaseapp.com',
        projectId: 'blowinglightgame',
        storageBucket: 'blowinglightgame.appspot.com',
        messagingSenderId: '156104728395',
        appId: '1:156104728395:web:a125940a2f0082e4cf92ce'
    });


    const db = firebase.firestore();
    return {
        set: function (collection, doc, data = {}, merge = false) {
            return this.ref(collection, doc).set(data, { merge: merge });
        },
        update: function (collection, doc, data) {
            return this.ref(collection, doc).update(data);
        },
        get: function (collection, doc = undefined) {
            let docRef = this.ref(collection, doc);
            if (!doc) return docRef.get();

            return docRef.get().then((doc) => {
                if (doc.exists) return doc.data();
                console.log('找不到文件: ' + doc);
                return {};
            }).catch((error) => {
                console.error('提取文件時出錯: ', error);
            });
        },
        delete: function (collection, doc) {
            return this.ref(collection, doc).delete();
        },
        add: function (collection, doc) {
            return this.ref(collection).add(doc);
        },
        onSnapshot: function (collection, doc, callback) {
            if (doc && $.isFunction(doc)) {
                callback = doc;
                doc = undefined;
            }

            if (callback && $.isFunction(callback)) {
                this.ref(collection, doc).onSnapshot(callback);
            }
        },
        ref: function (collection, doc = undefined) {
            if (doc) return db.collection(collection).doc(doc);
            return db.collection(collection);
        },
        deleteVal: firebase.firestore.FieldValue.delete(),
        arrayRemove: firebase.firestore.FieldValue.arrayRemove,
        arrayUnion: firebase.firestore.FieldValue.arrayUnion
    }

})();