var quill = new Quill('#editor', {
    modules: {
        toolbar: { container: '#toolbar-container' }
    },
    theme: 'snow',
    placeholder: 'What are you reading?'
});

// quill.addHandler('image')