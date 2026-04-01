Ext.define('Tualo.quill.form.field.QuillTextTemplateEditor', {
    extend: 'Tualo.quill.form.field.Editor',
    alias: ['widget.tualo_quill_texttemplate_editor'],
    language: null,

    initComponent: function () {
        var me = this;
        me.callParent();
        window.mEditor = this;

    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        try {
            me.editor = me.createEditor();
        } catch (e) {
            console.error(e);
        }
    },

    intern: false,
    createEditor: function (config) {
        var me = this,
            editor;

        Quill.prototype.getHtml = function () {
            return this.container.querySelector('.ql-editor').innerHTML;
        };


        var toolbarOptions = [
            [{ 'font': [] }],
            ['bold', 'italic', 'underline'],
            ['link'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['more']
        ];

        editor = new Quill('#' + this.id + '-inputEl-quilleditor', {
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        'customControl': () => { console.log('customControl was clicked') }
                    }
                }
            },
            theme: 'snow'
        });

        try {
            var customButton = document.querySelectorAll('.ql-more');
            customButton = customButton[customButton.length - 1];
            customButton.addEventListener('click', this.initContextMenu.bind(this));
        } catch (E) { }

        editor.on('text-change', function (delta, oldDelta, source) {
            me.intern = true;

            me.setValue(editor.getHtml());
            me.fireEvent('change', me, editor.getHtml());
            me.fireEvent('text-change', me, delta, oldDelta, source);

            me.intern = false;
        });
        editor.on('selection-change', function (range, oldRange, source) { me.fireEvent('selection-change', me, range, oldRange, source); });
        return editor;
    },
    initContextMenu: function (e) {


        var contextMenu = new Ext.menu.Menu({ items: [], width: 600, scrollable: 'y' });

        Tualo.Ajax.request({
            url: './ds/texttemplate/read',
            params: {
                filter: JSON.stringify([{
                    operator: 'eq',
                    property: 'texttemplate__klasse',
                    value: this.templateid
                }])
            },
            scope: this,
            json: function (o) {
                if (o.success) {

                    o.data.forEach(element => {

                        contextMenu.add({
                            text: element.texttemplate__text.substring(0, 70) + '...',
                            fulltext: element.texttemplate__text,
                            scope: this,
                            handler: this.onItemClick
                        })

                    });
                    var xy = [e.x, e.y];
                    contextMenu.showAt(xy);
                }
            }
        });

    },
    onDestroy: function () {
        // this.monacoeditor.dispose();
        this.callParent();
    },
    getSubmitValue: function () {
        var me = this;
        return me.editor.getHtml();
    },

    setValue: function (v) {
        var me = this,
            t = (new Date()).getTime();

        if (typeof me.lastchange == 'undefined') me.lastchange = (new Date()).getTime() - 1000;
        if (t - me.lastchange < 100) return;

        me.callParent([v]);
        me.lastchange = t;

        if (me.intern !== true) {
            if (me.editor) {
                me.editor.setContents(me.editor.clipboard.convert(v), 'silent');
            } else {
                me.on('editorReady', function () {
                    if (me.editor.getHtml() != me.editor.clipboard.convert(v))
                        me.editor.setContents(me.editor.clipboard.convert(v), 'silent');
                }, this, { single: true });
            }

        }

    },
});