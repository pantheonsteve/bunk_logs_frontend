import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Wysiwyg = () => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            const toolbarOptions = [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'size', 'list', 'align', 'justify'],
                ['clean']
            ];

            quillRef.current = new Quill(editorRef.current, {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow'
            });

            quillRef.current.on('text-change', function() {
                console.log(quillRef.current.root.innerHTML);
            });
        }
    }, []);

    return (
        <div>
            <h1>WYSIWYG Editor</h1>
            <div ref={editorRef} style={{ height: '300px' }}></div>
        </div>
    );
};

export default Wysiwyg;