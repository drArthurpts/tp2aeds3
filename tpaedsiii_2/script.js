
///min implementação de heap
class MinHeap {
	constructor() {
		this.heap_array = [];
	}

	///retorna o tamanho do heap mínimo
	size() {
		return this.heap_array.length;
	}

	///retorna se o heap estiver vazio
	empty() {
		return (this.size() === 0);
	}
	
	///insira um novo valor no heap
	push(value) {
		this.heap_array.push(value);
		this.up_heapify();
	}

	///atualiza o heap aumentando o heap
	up_heapify() {
		var current_index = this.size() - 1;
		while (current_index > 0) {
			var current_element = this.heap_array[current_index];
			var parent_index = Math.trunc((current_index - 1) / 2);
			var parent_element = this.heap_array[parent_index];

			if (parent_element[0] < current_element[0]) {
				break;
			}
			else {
				this.heap_array[parent_index] = current_element;
				this.heap_array[current_index] = parent_element;
				current_index = parent_index;
			}
		}
	}

	///retorna o elemento superior (elemento de menor valor)
	top() {
		return this.heap_array[0];
	}

	///exclua o elemento superior
	pop() {
		if (this.empty() == false) {
			var last_index = this.size() - 1;
			this.heap_array[0] = this.heap_array[last_index];
			this.heap_array.pop();
			this.down_heapify();
		}
	}

	///atualiza o heap diminuindo o heap
	down_heapify() {
		var current_index = 0;
		var current_element = this.heap_array[0];
		while (current_index < this.size()) {
			var child_index1 = (current_index * 2) + 1;
			var child_index2 = (current_index * 2) + 2;
			if (child_index1 >= this.size() && child_index2 >= this.size()) {
				break;
			}
			else if (child_index2 >= this.size()) {
				let child_element1 = this.heap_array[child_index1];
				if (current_element[0] < child_element1[0]) {
					break;
				}
				else {
					this.heap_array[child_index1] = current_element;
					this.heap_array[current_index] = child_element1;
					current_index = child_index1;
				}
			}
			else {
				var child_element1 = this.heap_array[child_index1];
				var child_element2 = this.heap_array[child_index2];
				if (current_element[0] < child_element1[0] && current_element[0] < child_element2[0]) {
					break;
				}
				else {
					if (child_element1[0] < child_element2[0]) {
						this.heap_array[child_index1] = current_element;
						this.heap_array[current_index] = child_element1;
						current_index = child_index1;
					}
					else {
						this.heap_array[child_index2] = current_element;
						this.heap_array[current_index] = child_element2;
						current_index = child_index2;
					}
				}
			}
		}
	}
}

///classe de decodificador codificador
class Codec {
	// construtor() {
//     este.códigos = {};
// }

	///dfs
	getCodes(node, curr_code) {
		///é o nó folha
		if (typeof (node[1]) === "string") {
			///maneira alternativa
			this.codes[node[1]] = curr_code;
			return;
		}

		///vá para esquerda
		this.getCodes(node[1][0], curr_code + '0');
		///Vire a direita
		this.getCodes(node[1][1], curr_code + '1');
	}

	///transformo a árvore humffman em um barbante
	make_string(node) {
		if (typeof (node[1]) === "string") {
			return "'" + node[1];
		}
		return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
	}
	///transformo uma string na árvore huffman
	make_tree(tree_string) {
		let node = [];
		if (tree_string[this.index] === "'") {
			this.index++;
			node.push(tree_string[this.index]);
			this.index++;
			return node;
		}
		this.index++;
		node.push(this.make_tree(tree_string)); // encontre e empurre o filho esquerdo
		this.index++;
		node.push(this.make_tree(tree_string)); // encontre e empurre a criança certa
		return node;
	}

	///função do codificador
	encode(data) {
		this.heap = new MinHeap();

		var mp = new Map();
		for (let i = 0; i < data.length; i++) {
			if (mp.has(data[i])) {
				let foo = mp.get(data[i]);
				mp.set(data[i], foo + 1);
			}
			else {
				mp.set(data[i], 1);
			}
		}
		if (mp.size === 0) {
			let final_string = "zer#";
			
			let output_message = "Compactação concluída e arquivo enviado para download. " + '\n' + "Taxa de compressão : " + (data.length / final_string.length).toPrecision(6);
			return [final_string, output_message];
		}

		if (mp.size === 1) {
			let key, value;
			for (let [k, v] of mp) {
				key = k;
				value = v;
			}
			let final_string = "one" + '#' + key + '#' + value.toString();
			let output_message = "Compactação concluída e arquivo enviado para download. " + '\n' + "Taxa de compressão : " + (data.length / final_string.length).toPrecision(6);
			return [final_string, output_message];
		}
		for (let [key, value] of mp) {
			this.heap.push([value, key]);
		}

		///maneira alternativa
// mp.forEach(função (valor, chave) {
//     console.log([valor, chave]);
// })
		while (this.heap.size() >= 2) {
			let min_node1 = this.heap.top();
			this.heap.pop();
			let min_node2 = this.heap.top();
			this.heap.pop();
			this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
		}
		var huffman_tree = this.heap.top();
		this.heap.pop();
		this.codes = {};
		this.getCodes(huffman_tree, "");

		///converter dados em dados codificados
		let binary_string = "";
		for (let i = 0; i < data.length; i++) {
			binary_string += this.codes[data[i]];
		}
		let padding_length = (8 - (binary_string.length % 8)) % 8;
		for (let i = 0; i < padding_length; i++) {
			binary_string += '0';
		}
		let encoded_data = "";
		for (let i = 0; i < binary_string.length;) {
			let curr_num = 0;
			for (let j = 0; j < 8; j++, i++) {
				curr_num *= 2;
				curr_num += binary_string[i] - '0';
			}
			encoded_data += String.fromCharCode(curr_num);
		}
		let tree_string = this.make_string(huffman_tree);
		let ts_length = tree_string.length;
		let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
		let output_message = "Compactação concluída e arquivo enviado para download. " + '\n' + "Taxa de compressão :" + (data.length / final_string.length).toPrecision(6);
		return [final_string, output_message];
	}

	///função decodificador
	decode(data) {
		let k = 0;
		let temp = "";
		while (k < data.length && data[k] != '#') {
			temp += data[k];
			k++;
		}
		if (k == data.length){
			alert("Arquivo inválido!\nPor favor, envie um arquivo .txt compactado válido para descompactar e tente novamente!");
			location.reload();
			return;
		}
		if (temp === "zer") {
			let decoded_data = "";
			let output_message = "Descompactação concluída e arquivo enviado para download.";
			return [decoded_data, output_message];
		}
		if (temp === "one") {
			data = data.slice(k + 1);
			k = 0;
			temp = "";
			while (data[k] != '#') {
				temp += data[k];
				k++;
			}
			let one_char = temp;
			data = data.slice(k + 1);
			let str_len = parseInt(data);
			let decoded_data = "";
			for (let i = 0; i < str_len; i++) {
				decoded_data += one_char;
			}
			let output_message = "Descompactação concluída e arquivo enviado para download.";
			return [decoded_data, output_message];

		}
		data = data.slice(k + 1);
		let ts_length = parseInt(temp);
		k = 0;
		temp = "";
		while (data[k] != '#') {
			temp += data[k];
			k++;
		}
		data = data.slice(k + 1);
		let padding_length = parseInt(temp);
		temp = "";
		for (k = 0; k < ts_length; k++) {
			temp += data[k];
		}
		data = data.slice(k);
		let tree_string = temp;
		temp = "";
		for (k = 0; k < data.length; k++) {
			temp += data[k];
		}
		let encoded_data = temp;
		this.index = 0;
		var huffman_tree = this.make_tree(tree_string);

		let binary_string = "";
		///recupera string binária de dados codificados
		for (let i = 0; i < encoded_data.length; i++) {
			let curr_num = encoded_data.charCodeAt(i);
			let curr_binary = "";
			for (let j = 7; j >= 0; j--) {
				let foo = curr_num >> j;
				curr_binary = curr_binary + (foo & 1);
			}
			binary_string += curr_binary;
		}
		///remover preenchimento
		binary_string = binary_string.slice(0, -padding_length);

		///decodifique os dados usando string binária e árvore huffman
		let decoded_data = "";
		let node = huffman_tree;
		for (let i = 0; i < binary_string.length; i++) {
			if (binary_string[i] === '1') {
				node = node[1];
			}
			else {
				node = node[0];
			}

			if (typeof (node[0]) === "string") {
				decoded_data += node[0];
				node = huffman_tree;
			}
		}
		let output_message = "Descompactação concluída e arquivo enviado para download.";
		return [decoded_data, output_message];
	}
}

///função onload
window.onload = function () {
	console.log("here onload");

	///acessando elementos dom
	decodeBtn = document.getElementById("decode");
	encodeBtn = document.getElementById("encode");
	fileForm = document.getElementById("fileform");
	uploadFile = document.getElementById("uploadfile")
	submitBtn = document.getElementById("submitbtn");
	step1 = document.getElementById("step1");
	step2 = document.getElementById("step2");
	step3 = document.getElementById("step3");
	

	isSubmitted = false;
	codecObj = new Codec();

	///chamado quando o botão enviar é clicado
	submitBtn.onclick = function () {
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("Nenhum arquivo enviado.\nFaça upload de um arquivo .txt válido e tente novamente!");
			return;
		}
		let nameSplit = uploadedFile.name.split('.');
		var extension = nameSplit[nameSplit.length - 1].toLowerCase();
		if (extension != "txt") {
			alert("Tipo de arquivo inválido (." + extension + ") \nFaça upload de um arquivo .txt válido e tente novamentein!");
			return;
		}				
		alert("Arquivo enviado!");
		isSubmitted = true;		
		onclickChanges("Feito!! Arquivo carregado!", step1);
	}

	///chamado quando o botão compactar é clicado
	encodeBtn.onclick = function () {
		console.log("encode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("Nenhum arquivo enviado.\nFaça upload de um arquivo e tente novamente!");
			return;
		}
		if (isSubmitted === false) {
			alert("Arquivo não enviado.\Por favor clique no botão enviar noe previous step\nto submit the file and try again!");
			return;
		}
		console.log(uploadedFile.size);
		if(uploadedFile.size === 0){
			alert("AVISO: você carregou um arquivo vazio!\nO tamanho do arquivo compactado pode ser maior que o arquivo descompactado (a taxa de compactação pode ser menor que um).\nAs taxas de compactação melhores são obtidas para tamanhos de arquivo maiores!");
		}	
		else if(uploadedFile.size <= 350){
			alert("AVISO: O arquivo enviado é muito pequeno(" + uploadedFile.size +" bytes) !\nO tamanho do arquivo compactado pode ser maior que o arquivo descompactado (a taxa de compactação pode ser menor que um).\nAs taxas de compactação melhores são obtidas para tamanhos de arquivo maiores!");
		}
		else if(uploadedFile.size < 1000){
			alert("AVISO: O arquivo enviado é pequeno(" + uploadedFile.size +" bytes) !\nO tamanho do arquivo compactado pode ser maior que o esperado (a taxa de compactação pode ser pequena).\nMelhores taxas de compactação são alcançadas para tamanhos de arquivo maiores!");
		}	
		onclickChanges("Feito!! Seu arquivo será compactado", step2);
		onclickChanges2("Compactando seu arquivo ...", "Compactado");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [encodedString, outputMsg] = codecObj.encode(text);
			myDownloadFile(uploadedFile.name.split('.')[0] + "saida.huf", encodedString);
			ondownloadChanges(outputMsg);
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
	}

	// chamado quando o botão descompactar é clicado
	decodeBtn.onclick = function () {
		console.log("decodificar onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("Nenhum arquivo enviado.\nFaça upload de um arquivo e tente novamente!");
			return;
		}
		if (isSubmitted === false) {
			alert("Arquivo não enviado.\n Clique no botão enviar na etapa anterior\npara enviar o arquivo e tentar novamente!");
			return;
		}
		onclickChanges("Feito!! Seu arquivo será descomprimido", step2);
		onclickChanges2("Descomprimindo seu arquivo ...", "Descomprimido");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [decodedString, outputMsg] = codecObj.decode(text);
			myDownloadFile(uploadedFile.name.split('.')[0] + "entrada.txt", decodedString);
			ondownloadChanges(outputMsg);
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
	}

}

///altera o dom quando a etapa 1 é concluída (a etapa 2 está em execução)
function onclickChanges(firstMsg, step) {
	step.innerHTML = "";
	let img = document.createElement("img");
	img.src = "assets/done_icon3.png";
	img.id = "doneImg";
	step.appendChild(img);
	var br = document.createElement("br");
	step.appendChild(br);
	let msg = document.createElement("span");
	msg.className = "text2";
	msg.innerHTML = firstMsg;
	step.appendChild(msg);
}

///altera o dom quando a etapa 2 é concluída (a etapa 3 está em execução)
function onclickChanges2(secMsg, word) {
	decodeBtn.disabled = true;
	encodeBtn.disabled = true;
	step3.innerHTML = "";
	let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = secMsg;
	step3.appendChild(msg2);
	// var br = document.createElement("br");
// passo3.appendChild(br);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = " , " + word + " o arquivo será baixado automaticamente!";
	step3.appendChild(msg3);
}

///função para baixar arquivo
function myDownloadFile(fileName, text) {
	let a = document.createElement('a');
	a.href = "data:application/octet-stream," + encodeURIComponent(text);
	a.download = fileName;
	a.click();
}

///mudou de domínio quando o arquivo foi baixado (etapa 3 concluída)
function ondownloadChanges(outputMsg) {
	step3.innerHTML = "";
	let img = document.createElement("img");
	img.src = "assets/done_icon3.png";
	img.id = "doneImg";
	step3.appendChild(img);
	var br = document.createElement("br");
	step3.appendChild(br);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = outputMsg;
	step3.appendChild(msg3);
}