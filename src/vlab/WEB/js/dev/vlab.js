var Vlab = {

    div : null,
    editor : null,
    isAlreadyInit : false,
    variant : null,

    setVariant : function(str){
        Vlab.variant = str;
    },

    setMode: function(str){
        console.log("setMode")
    },

    initPython : function(){

        if (!Vlab.isAlreadyInit) {



            var initCode = `
                try:
                    from js import document, console
                    import numpy as np
                    import scipy.stats as stats
                    import matplotlib.pyplot as plt
                    import io, base64
                    import traceback
                    import re
                    import pyodide
                    from scipy import fftpack
                    from scipy.fftpack import rfft,rfftfreq
                    
                    
                    def print_error(error):
                        js_errors = document.getElementById('errors')
                        js_errors.innerText = error
                        error = re.sub(r'line (\\d+)', lambda m: 'line {0}'.format(int(m.group(1)) - 3), error)
                        js_errors.style.visibility = "visible"
                        js_errors.innerText = error
                        return 1
                    
                except Exception as error:
                    js_errors = document.getElementById('errors')
                    js_errors.style.visibility = "visible"
                    js_errors.innerText = error
            `;
            try {
                pyodide.runPython(initCode);
            } catch (e) {
                alert("Критическая ошибка интерпретатора!!!\nЕсли вы не запускали интерпретатор и видите это сообщение, то это означает, что вы используете Google Chrome v90 или другой браузер на основе Chromium. Для решения проблемы вы можете использовать другой браузер, например Mozilla Firefox или Microsoft Edge, или обновить Google Chrome до версии v91. Также вы можете открыть инструменты разработчика вашего браузера и перезагрузить страницу.\nЕсли ошибка возникла после запуска интерпретатора, перезагрузите виртуальную лабораторию. Не забудьте скопировать код, после перезагрузки он вернется к значению по умолчанию.");
            }
            Vlab.isAlreadyInit = true;
        }
    },

    startPythonScript : function(code){
        try {
            pyodide.runPython(`
            result = ""
            
            try:
                from js import document, console
                import numpy as np
                import scipy.stats as stats
                import matplotlib.pyplot as plt
                import io, base64
                import traceback
                import re
                import pyodide
                from scipy import fftpack
                from scipy.fftpack import rfft,rfftfreq
                    
                    
                def print_error(error):
                    js_errors = document.getElementById('errors')
                    js_errors.innerText = error
                    error = re.sub(r'line (\\d+)', lambda m: 'line {0}'.format(int(m.group(1)) - 32), error)
                    js_errors.style.visibility = "visible"
                    js_errors.innerText = error
                    return 1
                    
            except Exception as error:
                js_errors = document.getElementById('errors')
                js_errors.style.visibility = "visible"
                js_errors.innerText = error
                    
            try:
                document.getElementById('errors').style.visibility = "hidden"
                document.getElementById('table_body').innerHTML = ""
                ` +
                code
                + `
                buffer = document.getElementById('buffer')
                img_tag = document.getElementById('fig')
                img_tag_2 = document.getElementById('fig2')
                img_tag.src = ""
                img_tag_2.src = ""
                
                def smooth(x,y,dots = 50):
                    c_x = np.zeros(len(x)//dots)
                    c_y = np.zeros(len(x)//dots)
                    for i in range(dots,len(x),dots):
                        c_x[i//dots] = x[i - dots]
                        c_y[i//dots] = np.sum(y[i-dots:i])/dots
                    return c_x, c_y
                
                variant = '` + Vlab.variant + `'
                
                file_1_0 = pyodide.open_url("https://raw.githubusercontent.com/ITI999/EDF_files/main/Subject" + variant + "_1_0.txt").read().split(' ')[:30000]
                file_1_15 = pyodide.open_url("https://raw.githubusercontent.com/ITI999/EDF_files/main/Subject" + variant + "_1_15.txt").read().split(' ')[:30000]
                file_2_0 = pyodide.open_url("https://raw.githubusercontent.com/ITI999/EDF_files/main/Subject" + variant + "_2_0.txt").read().split(' ')[:30000]
                file_2_15 = pyodide.open_url("https://raw.githubusercontent.com/ITI999/EDF_files/main/Subject" + variant + "_2_15.txt").read().split(' ')[:30000]
                
                
                Fp1_background = list(map(float,file_1_0))
                O2_background = list(map(float,file_1_15))
                Fp1_active = list(map(float,file_2_0))
                O2_active = list(map(float,file_2_15))
                
                fig, axs = plt.subplots(2, 2, sharex=True, sharey=True)
                fig.tight_layout(pad=3.0)
                
                x_1_0, y_1_0 = fourier_transform(Fp1_background)
                x_1_15, y_1_15 = fourier_transform(O2_background)
                x_2_0, y_2_0 = fourier_transform(Fp1_active)
                x_2_15, y_2_15 = fourier_transform(O2_active)
                
                dots_1 = 50
                dots_2 = 50
                    
                x_1_0, y_1_0 = smooth(x_1_0, y_1_0, dots = dots_1)
                x_1_15, y_1_15 = smooth(x_1_15, y_1_15, dots = dots_1)
                x_2_0, y_2_0 = smooth(x_2_0, y_2_0, dots = dots_2)
                x_2_15, y_2_15 = smooth(x_2_15, y_2_15, dots = dots_2)
                
                axs[0, 0].plot(x_1_0, y_1_0)
                axs[0, 0].set_title(u'Fp1, данные №1')
                axs[0, 0].set_xlim(0,50)
                
                axs[0, 1].plot(x_1_15, y_1_15, 'tab:orange')
                axs[0, 1].set_title(u'O2, данные №1')
                axs[0, 1].set_xlim(0,50)
                
                axs[1, 0].plot(x_2_0, y_2_0, 'tab:green')
                axs[1, 0].set_title(u'Fp1, данные №2')
                axs[1, 0].set_xlim(0,50)
                
                axs[1, 1].plot(x_2_15, y_2_15, 'tab:red')
                axs[1, 1].set_title(u'O2, данные №2')
                axs[1, 1].set_xlim(0,50)
                
                
                for ax in axs.flat:
                    ax.set(xlabel=u'Частота, Гц', ylabel=u'Напряжение, мВ')
                    ax.grid()
                
                buf = io.BytesIO()
                # copy the plot into the buffer
                plt.savefig(buf, format='png')
                buf.seek(0)
                # encode the image as Base64 string
                img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
                # show the image
                
                img_tag.src = img_str
                buf.close()
                
                
                x_1_0, y_1_0 = fourier_transform(Fp1_background)
                x_1_15, y_1_15 = fourier_transform(O2_background)
                x_2_0, y_2_0 = fourier_transform(Fp1_active)
                x_2_15, y_2_15 = fourier_transform(O2_active)
                
                
                
                waves_1_0 = histogram(x_1_0, y_1_0)
                waves_1_15  = histogram(x_1_15, y_1_15)
                waves_2_0 = histogram(x_2_0, y_2_0)
                waves_2_15 = histogram(x_2_15, y_2_15)
                
                x = ['delta','theta', 'alpha', 'beta','gamma']
                
                
                fig, axs = plt.subplots(2, 2, sharey=True)
                fig.tight_layout(pad=3.0)
                
                axs[0, 0].bar(x, waves_1_0.values())
                axs[0, 0].set_title(u'Fp1, данные №1')
                
                axs[0, 1].bar(x, waves_1_15.values(), color = 'orange')
                axs[0, 1].set_title(u'O2, данные №1')
                
                axs[1, 0].bar(x, waves_2_0.values(), color = 'green')
                axs[1, 0].set_title(u'Fp1, данные №2')
                
                axs[1, 1].bar(x, waves_2_15.values(), color = 'red')
                axs[1, 1].set_title(u'O2, данные №2')
                
                buf = io.BytesIO()
                # copy the plot into the buffer
                plt.savefig(buf, format='png')
                buf.seek(0)
                # encode the image as Base64 string
                img_str_2 = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
                # show the image
                
                img_tag_2.src = img_str_2
                buf.close()
                
                table_values = { 'Данные №1, Fp1, delta' : indicators(0.5, 4, x_1_0, y_1_0) + (waves_1_0['delta'],),
                    'Данные №2, Fp1, delta' : indicators(0.5, 4, x_2_0, y_2_0) + (waves_2_0['delta'],),
                    'Данные №1, O2, delta' : indicators(0.5, 4, x_1_15, y_1_15) + (waves_1_15['delta'],),
                    'Данные №2, O2, delta' : indicators(0.5, 4, x_2_15, y_2_15) + (waves_2_15['delta'],),
                    
                    'Данные №1, Fp1, theta' : indicators(4, 8, x_1_0, y_1_0) + (waves_1_0['theta'],),
                    'Данные №2, Fp1, theta' : indicators(4, 8, x_2_0, y_2_0) + (waves_2_0['theta'],),
                    'Данные №1, O2, theta' : indicators(4, 8, x_1_15, y_1_15) + (waves_1_15['theta'],),
                    'Данные №2, O2, theta' : indicators(4, 8, x_2_15, y_2_15) + (waves_2_15['theta'],),
                    
                    'Данные №1, Fp1, alpha' : indicators(8, 14, x_1_0, y_1_0) + (waves_1_0['alpha'],),
                    'Данные №2, Fp1, alpha' : indicators(8, 14, x_2_0, y_2_0) + (waves_2_0['alpha'],),
                    'Данные №1, O2, alpha' : indicators(8, 14, x_1_15, y_1_15) + (waves_1_15['alpha'],),
                    'Данные №2, O2, alpha' : indicators(8, 14, x_2_15, y_2_15) + (waves_2_15['alpha'],),
                    
                    'Данные №1, Fp1, beta' : indicators(14, 30, x_1_0, y_1_0) + (waves_1_0['beta'],),
                    'Данные №2, Fp1, beta' : indicators(14, 30, x_2_0, y_2_0) + (waves_2_0['beta'],),
                    'Данные №1, O2, beta' : indicators(14, 30, x_1_15, y_1_15) + (waves_1_15['beta'],),
                    'Данные №2, O2, beta' : indicators(14, 30, x_2_15, y_2_15) + (waves_2_15['beta'],),
                    
                    'Данные №1, Fp1, gamma' : indicators(14, 30, x_1_0, y_1_0) + (waves_1_0['gamma'],),
                    'Данные №2, Fp1, gamma' : indicators(14, 30, x_2_0, y_2_0) + (waves_2_0['gamma'],),
                    'Данные №1, O2, gamma' : indicators(14, 30, x_1_15, y_1_15) + (waves_1_15['gamma'],),
                    'Данные №2, O2, gamma' : indicators(14, 30, x_2_15, y_2_15) + (waves_2_15['gamma'],)}
                
                document.getElementById('table_body').innerHTML = ""
                
                #from math import floor, log10
                #def round_to_1(x,d = 0):
                #    return round(x, -int(floor(log10(abs(x)))) + d)
                   
                result = ""
                
                for key in table_values.keys():
                    tr = document.createElement('tr')
                    td = document.createElement('td')
                    txt = document.createTextNode(key)
                    td.appendChild(txt)
                    tr.appendChild(td)
                    
                    for item in table_values[key]:
                        result += '%s' % float('%.4g' % item) + " "
                        td = document.createElement('td')
                        txt = document.createTextNode('%s' % float('%.4g' % item))
                        td.appendChild(txt)
                        tr.appendChild(td)
                        
                    document.getElementById('table_body').appendChild(tr)
                
                
                
                    
                
            except Exception as error:
                print_error(traceback.format_exc())
            `);
        } catch (e)  {
            alert("Критическая ошибка интерпретатора!!!\nЕсли вы не запускали интерпретатор и видите это сообщение, то это означает, что вы используете Google Chrome v90 или другой браузер на основе Chromium. Для решения проблемы вы можете использовать другой браузер, например Mozilla Firefox или Microsoft Edge, или обновить Google Chrome до версии v91. Также вы можете открыть инструменты разработчика вашего браузера и перезагрузить страницу.\nЕсли ошибка возникла после запуска интерпретатора, перезагрузите виртуальную лабораторию. Не забудьте скопировать код, после перезагрузки он вернется к значению по умолчанию.");
        }
    },

    update : function(){
        let code = "";
        Vlab.editor.getValue().split("\n").forEach(function(item, i ,arr){
            code += item + `
                `;
        });
        Vlab.startPythonScript(code);
        console.log(Vlab.getResults());
    },

    //Инициализация ВЛ
    init : function(){
        this.div = document.getElementById("jsLab");
        var htmlCode =
            '<div id="MainContainer">' +
            '<div class="vlab_settings">' +
            '   <div class="block_title">' +
            '       <div class="vlab_name">Анализ электроэнцефалограммы</div>' +
            '       <input class="btn_help btn"  type="button" onclick="PopUpShow()" value="Справка" title="Справка по работе с лабораторией"/>' +
            '   </div>' +
            '</div>' +
            "<div id='container' >" +
            "<div id='editor' ></div>" +
            "<div id='errors'></div>" +
            "<div id='buffer'></div>" +
            "<div class='output' >" +
            "   <img id='fig' style='display:block'/>" +
            "   <img id='fig2' style='display:none'/>" +
            "   <div id='resultInd' style='display:none'>" +
            "   <table id='resultTable' class='table_blur'>" +
            "       <thead>" +
            "           <tr>" +
            "           <th>Электрод, данные, диапазон</th>" +
            "           <th>Aav</th>" +
            "           <th>Amax</th>" +
            "           <th>Fav</th>" +
            "           <th>Fmax</th>" +
            "           <th>Ai/A</th>" +
            "       </tr>" +
            "       </thead>" +
            "       <tbody id='table_body'>" +
            "       </tbody>" +
            "   </table>" +

            "</div>" +
            "<button class='btn btn_start' id='start_button'  onclick='startButtonClick()' >Запустить</button>" +
            "<button class='btn btn_graph' id='graph_button'  onclick='graphButtonClick()' >Графики</button>" +
            "<button class='btn btn_hist' id='hist_button'  onclick='histButtonClick()' >Гистограммы</button>" +
            "<button class='btn btn_table' id='table_button'  onclick='tableButtonClick()' >Показатели</button>" +
            "<div id='question'>" +
            "<p>Используя полученные результаты, определите какой из наборов данных соответствует расслабленному состоянию:</p>" +
            '<input type="radio" name="dataNumber" value="1" checked>Набор данных №1 <br>' +
            '<input type="radio" name="dataNumber" value="2" >Набор данных №2<br>' +
            "</div>" +
            "</div >" +
            "</div>" +
            "</div>" +



            '<div class="b-popup" style="display: none" id="popup1">' +
            '<div class="b-popup-content">' +
            '<h1>&emsp;Справка</h1>' +
            '<p>&emsp;&emsp;<b>Важно!!! </b> Если вы внесли изменения в код, обязательно запустите интерпретатор, иначе результаты вычислений, отправляемые на сервер, не будут изменены. Также, если после нажатия кнопки "запустить", она не оставалась нажатой в течении несколькихм секунд, то произошла критическая ошибка интерпретатора, перезапустите страницу, перед этим скопировав ваш код.</p>' +
            '<p>&emsp;&emsp;Для выполнения лабораторной реализуйте данные функции:</p>' +
            '<p>&emsp;&emsp;<b>fourier_transform(data)</b> - функция, реализующая преобразование Фурье, принимает на вход массив значений' +
            ' с одного электрода. Возвращаемыми значениями являются: х - массив частот, ' +
            'y - массив амплитуд. Частота сигнала 500Гц. Для преобразования Фурье используйте методы fftpack.rfft и fftpack.rfftfreq пакета scipy. Импортировать scipy не нужно. </p>' +
            '<p>&emsp;&emsp;<b>histogram(x, y)</b> - функция должна возвращать отношения мощности частот каждого из диапазонов к суммарной мощности ЭЭГ. ' +
            'Диапазоны: дельта-диапазон - от 0.5 до 4, тета-диапазон - от 4 до 8, альфа-диапазон - от 8 до 14, бета-диапазон - от 14 до 30, гамма-диапазон - от 30 до 100.</p>' +
            '<p>&emsp;&emsp;<b>indicators(start, end, x, y)</b> - функция, возвращающая обобщённые показатели спектра в указанном диапазоне. ' +
            'start и end - начало и конец диапазона соответственно. Aav - средняя амплитуда спектра, Amax - максимальная амплитуда спектра, Fmax - частота максимальной по амплитуде гармоники, ' +
            'Fav - средневзвешенная частота, соответствует центру тяжести фигуры, вычисляется как </p>' +
            '<p><img id="LaTeX_img" src="http://latex.codecogs.com/gif.latex?x=\\frac{\\sum\\left(Ai*Fi\\right)}{\\sum Ai}" border="0"/></p>' +
            '<input class="btn_help btn" type="button" onclick="PopUpHide()" value="Закрыть" title="Справка по работе с лабораторией"/>' +
            '</div>' +
            '</div>'

            ;



        console.log(htmlCode);
        this.div.innerHTML = htmlCode;



        var start_btn = document.getElementById('start_button');
        start_btn.classList.remove('btn');
        start_btn.classList.add('disabledButton');
        start_btn.disabled = true;

        // document.getElementById("tool").innerHTML = "<div>tool</div>";

        // window.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.17.0a2/full/';


        var langTools = ace.require("ace/ext/language_tools");
        Vlab.editor = ace.edit("editor");
        Vlab.editor.setTheme("ace/theme/crimson_editor");
        Vlab.editor.session.setMode("ace/mode/python");
        Vlab.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        var initEditorCode =
            `def fourier_transform(data):
    x = []
    y = []
    return x,y
   
def histogram(x,y):
    waves = { 'delta' : 0,
            'theta' : 0,
            'alpha' : 0,
            'beta' : 0,
            'gamma' : 0}
    total = 0
    
    return waves
       
def indicators(start, end, x, y):
    A_max = 0
    A_av = 0
    F_max = 0
    F_av = 0
    
    return A_max, A_av, F_max, F_av
     
`;


        var variantCode = document.getElementById("preGeneratedCode").value;
        if(variantCode.length == 2) {
            Vlab.setVariant(variantCode);
        } else {
            function randomInteger(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let map = new Map();
            map.set(0,"18");
            map.set(1,"03");
            map.set(2,"27");
            map.set(3,"28");
            variantCode = map.get(randomInteger(0,3));
            console.log(variantCode);
            Vlab.setVariant(variantCode);
        }

        Vlab.editor.session.insert(0, initEditorCode);



        let time = 0;
        let step = 0;
        languagePluginLoader.then(() => {
            languagePluginLoader.then(async () => {
                return await pyodide.loadPackage(['scipy','matplotlib','numpy']);
            }).then(() => {
                start_btn.disabled = false;
                start_btn.classList.remove('disabledButton');
                start_btn.classList.add('btn');
                Vlab.initPython();
                // Vlab.editor.getSession().on('change', function(){
                //     clearTimeout(time);
                //
                //     time = setTimeout(function() {
                //         // enter code here or a execute function.
                //         Vlab.update(Vlab.editor);
                //     }, 3000);
                // });
                // Vlab.update(Vlab.editor);
            });

        });

    },

    getCondition: function(){

    },

    getResults: function(){
        var radios = document.getElementsByName('dataNumber');

        var answer = '1';
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                // do whatever you want with the checked radio
                answer = radios[i].value;

                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        var jsonAnswer = {
            dataNumber : answer,
            indicators : pyodide.globals.get('result')
        };

        return JSON.stringify(jsonAnswer);
    },

    calculateHandler: function(text, code){
        console.log("calculateHandler");
    },
};

window.onload = function() {
    Vlab.init();
};
