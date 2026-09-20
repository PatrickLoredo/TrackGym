window.addEventListener("load", () => {
    /*document.getElementById('btnCadastrarFicha').click()
    document.getElementById('btnChevronTreino_Ficha_fch_1_Treino_A').click()*/

    exibeProximoTreino();
});



/* =======================ARRAYS GERAIS==================================*/
/*ARRAY DE ARRAY DE IDS CADASTRADOS - NUNCA MANIPULAVEL APENAS INSERSÍVEL PARA CONTROLE
INDEX 0: EXERCICIOS
INDEX 1: CATEGORIAS EXERCICIOS
INDEX 2: FICHAS CADASTRADAS
*/
let arrayIdsUtilizados = JSON.parse(localStorage.getItem('idsUtilizados')) || [[], [], []];
let arrayExercicios = JSON.parse(localStorage.getItem('cadastroExercicio')) || [];
let arrayCategorias = JSON.parse(localStorage.getItem('cadastroCategoria')) || [];
let arrayFichas = JSON.parse(localStorage.getItem('cadastroFicha')) || [];
let arrayUltimoTreinoConcluido = JSON.parse(localStorage.getItem('ultimoTreinoConcluido')) || [];

let letrasTreinos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

let contadorID = 0;
let totalContadorExercicios = 0;
/* =======================CLASSES DE OBJETOS==================================*/
/* =======================================================================*/
class Exercicio {
    constructor(id = null, nome = '') {
        this.id = id;
        this.nome = nome;
    }
}

class Categoria {
    constructor(id = null, nome = '') {
        this.id = id;
        this.nome = nome;
    }
}

class ExercicioFicha {
    constructor(
        idExercicio = null,
        nomeExercicio = '',
        series = 0,
        repeticoes = 0,
        carga = 0,
        dificuldade = 'Normal'
    ) {
        this.idExercicio = idExercicio;
        this.nomeExercicio = nomeExercicio;
        this.series = series;
        this.repeticoes = repeticoes;
        this.carga = carga;
        this.dificuldade = dificuldade;
    }
}

class Treino {
    constructor(id = null, letra = null) {
        this.id = id;
        this.letra = letra;
        this.gruposMusculares = [];
        this.exercicios = [];
    }

    adicionarGrupoMuscular(grupo) {
        if (!this.gruposMusculares.includes(grupo)) {
            this.gruposMusculares.push(grupo);
        }
    }

    adicionarExercicio(exercicio) {
        this.exercicios.push(exercicio);
    }
}

class Ficha {
    constructor(id = null, dataInicio = null, dataConclusao = null) {
        this.id = id;
        this.dataInicio = dataInicio;
        this.dataConclusao = dataConclusao;
        this.treinos = [];
    }

    adicionarTreino(treino) {
        this.treinos.push(treino);
    }
}

class TreinoConcluido{
    constructor(idFicha, letraFichaTreino, dataConclusao, statusFicha){
        this.idFicha = idFicha;
        this.letraFichaTreino = letraFichaTreino;
        this.dataConclusao = dataConclusao;
        this.statusFicha = statusFicha;
    }
}

/* =======================FUNÇÕES GERAIS==================================*/
/* =======================================================================*/
//FORMATA A DATA PARA O FORMATO AAAA/MM/DD [INPUT][OK]
function dataAtualFormatada(campo) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');

    let campoData = document.getElementById(campo);
    let dataAualizada = `${ano}-${mes}-${dia}`;

    campoData.value = dataAualizada
}

//FORMATA A DATA PARA O FORMATO DD/MM/AAAA [OK]
function formatarDataBR(dataIso) {
    if (!dataIso) return '-';
    const partes = dataIso.split('-');
    if (partes.length !== 3) return dataIso;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

//FUNCAO QUE GERA IDS DE ELEMENTOS [ÓK]
function gerarNovoId(indice, alias, campoId) {
    let campoAtualizaId = document.getElementById(campoId);
    let ultimoId = arrayIdsUtilizados[indice].length;
    let proximoId = ultimoId + 1;

    campoAtualizaId.value = `${alias}_${proximoId}`;
}

// MUDA O CHEVRON PARA UP E DOWN [OK]
function mudaChevron(id) {
    const icone = document.getElementById(id);

    if (icone.classList.contains('fa-chevron-down')) {
        icone.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
    else if (icone.classList.contains('fa-chevron-up')) {
        icone.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

// ALTERNA OS TIPOS DE BUTTONS DE SAVE PARA EDIT E VICE VERSA [OK]
function alternaBtnSaveEdit(idEdit, idSave, escolha, idNome) {
    const btnEdit = document.getElementById(idEdit);
    const btnSave = document.getElementById(idSave);
    const inputNome = document.getElementById(idNome);

    if (escolha === 'editar') {
        btnEdit.classList.replace('d-block', 'd-none');
        btnSave.classList.replace('d-none', 'd-block');
        inputNome.disabled = false
    }
    if (escolha === 'salvar') {
        btnEdit.classList.replace('d-none', 'd-block');
        btnSave.classList.replace('d-block', 'd-none');
        inputNome.disabled = true;
    }
}

// OKA ATE O MOMENTO NAO FINALIZADO
function geraCardsFichaTreino() {
    const campoCadastroTreinos = document.getElementById('campoCadastroTreinos');
    const idFicha = document.getElementById('campoIDCadastroFicha');
    const qtdTreinos = document.getElementById('campoQtdTreinosFicha').value;
    campoCadastroTreinos.innerHTML = '';
    let IDSTRING = String(idFicha.value);

    for (let i = 0; i < qtdTreinos; i++) {
        campoCadastroTreinos.insertAdjacentHTML('beforeend', `
            <div class="col-12 mb-3">
                <div class="card">
                    <div class="card-header bg-warning">
                        <div class="row">
                            <div class="col">
                                <span class="uppercase tamanho10 text-light fw-bold">
                                    Ficha de Treino ${letrasTreinos[i]}
                                </span>
                            </div>
                            <div class="col-auto">
                                <button class="btn btn-sm btn-dark"
                                    id="btnChevronTreino_Ficha_${IDSTRING}_Treino_${letrasTreinos[i]}"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#cardBodyFicha_${IDSTRING}_Treino_${letrasTreinos[i]}"
                                    onclick="  mudaChevron(
                                    'iconeChevronFicha_${IDSTRING}_Treino_${letrasTreinos[i]}');

                                    populaCheckboxArray(
                                    arrayCategorias,
                                    'exibeGruposMuscularesFicha_${i}'
                                    );">

                                    <i class="fa fa-chevron-down"
                                        id="iconeChevronFicha_${IDSTRING}_Treino_${letrasTreinos[i]}">
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body collapse" id="cardBodyFicha_${IDSTRING}_Treino_${letrasTreinos[i]}">
                        <div class="row mb-3">
                            <div class="col-12">
                                <div class="row pb-3">
                                    <div class="col">
                                        <h6 class="uppercase tamanho08">
                                            Grupo Muscular Alvo
                                        </h6>
                                    </div>
                                </div>
                                <div class="row" id="exibeGruposMuscularesFicha_${i}"></div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <hr>
                            <div class="col-12">
                                <div class="row container m-auto">
                                    <div class="col" id="campoInsereExerciciosFicha_${i}"></div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer mt-4">
                            <div class="row mt-2">
                                <div class="col gap-2">
                                    <div class="input-group">
                                        <button class="btn btn-sm btn-danger input-group-text w-75"
                                            onclick=" addExercicioFicha(
                                                    'campoInsereExerciciosFicha_${i}',
                                                    'contadorFicha_${letrasTreinos[i]}',
                                                    '${IDSTRING}',
                                                    '${letrasTreinos[i]}')">
                                            <i class="fa fa-circle-plus"></i>&nbsp;
                                            <span class="uppercase tamanho08">
                                                adicionar novo exercício
                                            </span>
                                        </button>
                                        
                                        <input type="number" class="form-control mt-2" value="0"
                                        id="contadorFicha_${letrasTreinos[i]}" disabled>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}

function addExercicioFicha(idCampoExericio, idCampoContador, idFicha, letraTreino) {
    let fichaId = idFicha;
    let campoExercicioInsere = document.getElementById(idCampoExericio);
    let letraDoTreino = letraTreino;
    let contadorExercicios = document.getElementById(idCampoContador);
    let totalContadorExercicios = Number(contadorExercicios.value);

    contadorID ++;
    totalContadorExercicios++;

    contadorExercicios.value = totalContadorExercicios;

    let idInput = `IdExercicioFicha_${fichaId}_Treino_${letraDoTreino}_Exercicio_${contadorID}`;
    let idSelect = `idSelectExercicios${fichaId}_Treino_${letraDoTreino}_Exercicio_${contadorID}`;

    console.log(idInput)
    console.log(idSelect)

campoExercicioInsere.insertAdjacentHTML('beforeend', `
    <div class="row exercicio-ficha" data-ficha="${fichaId}" data-treino="${letraDoTreino}" data-exercicio="${contadorID}">
            <div class="col-12 mb-3">
                <input type="text" class="form-control" disabled id="${idInput}">
            </div>
            <div class="col-12 mb-3">
                <div class="input-group">
                    <span class="input-group-text bg-dark text-light">
                        <i class="fa fa-star"></i>
                    </span>

                    <select  class="form-select uppercase tamanho08 text-center"
                        id="${idSelect}" 
                        onchange="
                            verificaIdcomSelect('${idSelect}','${idInput}',arrayExercicios);
                            atualizaSelectsExercicios('${fichaId}', '${letraDoTreino}');">
                    </select>

                    <button type="button" class="btn btn-sm btn-danger input-group-text"
                        onclick="removeExercicioFicha('${idSelect}', '${fichaId}', '${letraDoTreino}')">
                        <i class="fa fa-trash"></i>
                    </button>

                    <button  class="btn btn-sm btn-primary input-group-text"
                        data-bs-toggle="collapse"
                        data-bs-target="#InfoExercicio_Ficha${fichaId}_Treino${letraDoTreino}_Exericio${contadorID}"
                        onclick="mudaChevron('chevronInfoExercicio_Ficha${fichaId}_Treino${letraDoTreino}_Exericio${contadorID}')">
                            <i class="fa fa-chevron-down" 
                            id="chevronInfoExercicio_Ficha${fichaId}_Treino${letraDoTreino}_Exericio${contadorID}"></i>
                    </button>
                </div>
            </div>
            <div class="col-12">
                <div class="row collapse mb-3" 
                id="InfoExercicio_Ficha${fichaId}_Treino${letraDoTreino}_Exericio${contadorID}">
                    <div class="col">
                        <div class="card" style="border: 2.5px solid rgba(11, 94, 215,0.5)">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-2 mb-3">
                                        <label class="labelText"> séries</label>

                                        <input  type="number" class="form-control"
                                            min="1" max="10" value="3">
                                    </div>

                                    <div class="col-3 mb-3">
                                        <label class="labelText">Repet</label>

                                        <input type="number" class="form-control"
                                            min="1" max="10" value="12">
                                    </div>
                                    <div class="col-3 mb-3">
                                        <label class="labelText">Carga</label>

                                        <input type="number" class="form-control"
                                            min="1" max="900" value="5">
                                    </div>

                                    <div class="col mb-3">
                                        <label class="labelText">Dificuldade</label>

                                        <select class="form-select uppercase text-center">
                                            <option class="Fácil">Fácil</option>
                                            <option class="Normal" selected>Normal</option>
                                            <option class="Difícil">Difícil</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);


    populaSelect('exercicio',arrayExercicios,idSelect);
    verificaIdcomSelect(idSelect,idInput,arrayExercicios);
    atualizaContadorExercicios(fichaId, letraDoTreino);

    
}

// IDENTIFICA O ID DO CADASTRO NO ARRAY DE EXERCICIOS DE ACORDO COM OPTION DO SELECT DE EXERCICIOS [OK]
function verificaIdcomSelect(idSelect, campoId, array) {
    const campoSelectTreino = document.getElementById(idSelect);
    const campoIDTreino = document.getElementById(campoId);

    let indiceCadastro = array.findIndex(cadastro => cadastro.nome === campoSelectTreino.value);

    if (indiceCadastro > -1) {
        campoIDTreino.value = array[indiceCadastro].id
    }
    else {
        return
    }
}

// POPULA O SELECT CONFORME O ARRAY DESEJADO [OK]
function populaSelect(tipo, array, idSelect) {
    const selectAtual = document.getElementById(idSelect);

    // Identifica ficha e treino pelo ID do select
    const partes = idSelect.match(
        /idSelectExercicios(.+)_Treino_(.+)_Exercicio_/
    );

    if (!partes) {
        console.error('Não foi possível identificar ficha/treino:', idSelect);
        return;
    }

    const fichaId = partes[1];
    const letraTreino = partes[2];

    // Pega somente os selects da mesma ficha e do mesmo treino
    const selects = document.querySelectorAll(
        `select[id^="idSelectExercicios${fichaId}_Treino_${letraTreino}_Exercicio_"]`
    );

    // Descobre quais exercícios já foram escolhidos
    const exerciciosSelecionados = [];

    selects.forEach(select => {
        if (select.id !== idSelect && select.value) {
            exerciciosSelecionados.push(select.value);
        }
    });

    // Limpa as opções atuais
    selectAtual.innerHTML = '';

    // Adiciona apenas os exercícios ainda disponíveis
    array.forEach(exercicio => {

        if (exerciciosSelecionados.includes(exercicio.nome)) {
            return;
        }

        const objetoOption = document.createElement('option');

        objetoOption.value = exercicio.nome;
        objetoOption.id = `option_${tipo}_${exercicio.nome}`;
        objetoOption.textContent = exercicio.nome;

        selectAtual.appendChild(objetoOption);
    });
}

function atualizaSelectsExercicios(fichaId, letraTreino) {
    const selects = document.querySelectorAll(
        `select[id^="idSelectExercicios${fichaId}_Treino_${letraTreino}_Exercicio_"]`
    );

    const selecionados = [...selects]
        .map(select => select.value)
        .filter(value => value !== '');

    selects.forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = '';
        arrayExercicios.forEach(exercicio => {

            if (!selecionados.includes(exercicio.nome) || exercicio.nome === valorAtual) {
                const option = document.createElement('option');
                option.value = exercicio.nome;
                option.textContent = exercicio.nome;
                option.id = `option_exercicio_${exercicio.nome}`;

                if (exercicio.nome === valorAtual) {
                    option.selected = true;
                }

                select.appendChild(option);
            }
        });
    });
}

function atualizaContadorExercicios(fichaId, letraTreino) {
    const selects = document.querySelectorAll(
        `select[id^="idSelectExercicios${fichaId}_Treino_${letraTreino}_Exercicio_"]`
    );

    const contador = document.getElementById(
        `contadorFicha_${letraTreino}`
    );

    if (contador) {
        contador.value = selects.length;
    }
}

function removeExercicioFicha(idSelect, fichaId, letraTreino) {

    const select = document.getElementById(idSelect);

    if (!select) {
        return;
    }

    const row = select.closest('.row');

    if (!row) {
        return;
    }

    // Remove o exercício
    row.remove();

    // Atualiza os selects
    atualizaSelectsExercicios(fichaId, letraTreino);

    // Atualiza o contador
    atualizaContadorExercicios(fichaId, letraTreino);
}

// POPULA CAMPOS COM CHECKBOX'S DE ELEMENTOS DE ARRAY[OK]
function populaCheckboxArray(array, idCampo) {
    const campoCheckbox = document.getElementById(idCampo);

    campoCheckbox.innerHTML = '';

    for (let i = 0; i < array.length; i++) {

        campoCheckbox.insertAdjacentHTML('beforeend', `
            <div class="col-4 d-flex justify-content-start">

                <input
                    type="checkbox"
                    id="checkbox_${array[i].nome}">

                <label
                    class="uppercase tamanho08"
                    for="checkbox_${array[i].nome}">
                    &nbsp;&nbsp;${array[i].nome}
                </label>

            </div>
        `);
    }
}

// LIMPA UM CAMPO UNICO [OK]
function limpaInputUnico(id) {
    const campo = document.getElementById(id);
    campo.value = ''
}

// SALVA ELEMENTO SEJA ELE EXERCICIO OU CATEGORIA [OK]
function salvarCadastro(campoId, campoNome, tipo, indiceArray, array) {
    let campoIdCadastro = document.getElementById(campoId).value;
    let campoNomeCadastro = document.getElementById(campoNome).value;

    let cadastroExiste = array.some(elemento => elemento.nome === campoNomeCadastro.trim());

    if (campoNomeCadastro.trim() === '') {
        alert(`Preencha o campo obrigatório de nome do(a) ${tipo}`);
    }

    else {
        if (cadastroExiste) {
            alert(`O(a) ${tipo} ${campoNomeCadastro} já está cadastrado(a) ! Tente outro(a) ${tipo}.`)
        }
        else {
            if (tipo === 'exercicio') {
                let novoCadastro = new Exercicio(campoIdCadastro, campoNomeCadastro);
                array.push(novoCadastro);
                arrayIdsUtilizados[indiceArray].push(campoIdCadastro);

                localStorage.setItem('cadastroExercicio', JSON.stringify(array))
                localStorage.setItem('idsUtilizados', JSON.stringify(arrayIdsUtilizados))

                alert(`O(a) ${tipo} ${campoNomeCadastro} foi cadastrado(a) com sucesso !`)

                gerarNovoId(0, 'exe', 'campoIDCadastroExercicio');
                limpaInputUnico(campoNome);
                document.getElementById(campoNome).focus();
                populaInputCadastrosArray('bodyExibicaoListaExerciciosCadastrados', arrayExercicios)
                campoNomeCadastro.focus()
            }

            else if (tipo === 'categoria') {
                let novoCadastro = new Categoria(campoIdCadastro, campoNomeCadastro);
                array.push(novoCadastro);
                arrayIdsUtilizados[indiceArray].push(campoIdCadastro);

                localStorage.setItem('cadastroCategoria', JSON.stringify(array))
                localStorage.setItem('idsUtilizados', JSON.stringify(arrayIdsUtilizados))

                alert(`O(a) ${tipo} de grupo Muscular ${campoNomeCadastro} foi cadastrado(a) com sucesso !`)

                gerarNovoId(1, 'cat', 'campoIDCadastroCategoria');
                limpaInputUnico(campoNome);
                document.getElementById(campoNome).focus();
            }
        }
    }
}

// SOBSCREVE UM CADASTRO DE ACORDO COM AS DEFINIÇÕES DO ARRAY [OK]
function sobscreveCadastro(idId, idNome, tipo) {
    const campoId = document.getElementById(idId);
    const campoNome = document.getElementById(idNome);

    let arrayEscolhido;
    let chaveLocalStorage;

    if (tipo === 'exercicio') {
        arrayEscolhido = arrayExercicios;
        chaveLocalStorage = 'cadastroExercicio';
    }
    else if (tipo === 'categoria') {
        arrayEscolhido = arrayCategorias;
        chaveLocalStorage = 'cadastroCategoria';
    }

    const indiceArray = arrayEscolhido.findIndex(
        cadastro => cadastro.nome === campoNome.value.trim()
    );

    const indiceId = arrayEscolhido.findIndex(
        cadastro => cadastro.id == campoId.value
    );

    if (indiceArray > -1 && indiceArray !== indiceId) {
        alert('O cadastro já existe salvo no banco de dados. Tente novamente.');
        return;
    }

    if (indiceId > -1) {
        arrayEscolhido[indiceId].nome = campoNome.value.trim();
        localStorage.setItem(chaveLocalStorage, JSON.stringify(arrayEscolhido));

        alert(`Cadastro de ${tipo} alterado com sucesso!`);
    }
}

//POPULA INPUTS COM BUTTONS DE E-S-T [EDIT/SAVE/TRASH] [OK]
function populaInputCadastrosArray(idCampo, tipo, array) {
    const campoPopula = document.getElementById(idCampo);
    campoPopula.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
        campoPopula.innerHTML += `
            <div class="row mb-2">
                <div class="row mb-2">
                    <div class="col uppercase tamanho08">
                        <div class="input-group">
                            <span class="input-group-text bg-danger text-light">
                                <i class="fa fa-star p-1"></i>
                            </span>

                            <input type="text" class="form-control d-none" id="input_${tipo}_${array[i].id}"  value="${array[i].id}" disabled>
                            <input type="text" class="form-control" id="input_${tipo}_${array[i].nome}"  value="${array[i].nome}" disabled>

                            <button class="btn btn-success input-group-text d-none" id="btnSalvar_${tipo}_${array[i].id}"
                                onclick=" alternaBtnSaveEdit('btnEditar_${tipo}_${array[i].id}', 'btnSalvar_${tipo}_${array[i].id}', 'salvar', 'input_${tipo}_${array[i].nome}' );
                                sobscreveCadastro('input_${tipo}_${array[i].id}','input_${tipo}_${array[i].nome}','${tipo}');">
                                <i class="fa fa-save"></i>
                            </button>


                            <button class="btn btn-primary input-group-text d-block" id="btnEditar_${tipo}_${array[i].id}"
                                onclick=" alternaBtnSaveEdit('btnEditar_${tipo}_${array[i].id}', 'btnSalvar_${tipo}_${array[i].id}', 'editar','input_${tipo}_${array[i].nome}');">
                                <i class="fa fa-edit"></i>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

function scrollParaElemento(idElemento) {
    const elemento = document.getElementById(idElemento);

    if (!elemento) {
        console.error(`Elemento não encontrado: ${idElemento}`);
        return;
    }

    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =======================FUNÇÕES GERAIS==================================*/
/* =======================================================================*/
function recuperarExerciciosTreino(fichaId, letraTreino) {
    const exercicios = [];
    const elementos = document.querySelectorAll(
        `.exercicio-ficha[data-ficha="${fichaId}"][data-treino="${letraTreino}"]`
    );

    elementos.forEach(elemento => {
        const selectExercicio =
            elemento.querySelector('select[id^="idSelectExercicios"]');
        const campoId =
            elemento.querySelector('input[id^="IdExercicioFicha_"]');

        const inputsNumericos =
            elemento.querySelectorAll('input[type="number"]');

        const selects =
            elemento.querySelectorAll('select');

        if (!selectExercicio) {
            return;
        }

        const exercicio = new ExercicioFicha(
            campoId?.value || null,
            selectExercicio.value,
            Number(inputsNumericos[0]?.value || 0),
            Number(inputsNumericos[1]?.value || 0),
            Number(inputsNumericos[2]?.value || 0),
            selects[1]?.value || 'Normal'
        );
        exercicios.push(exercicio);
    });
    return exercicios;
}

function recuperarGruposMusculares(indiceTreino) {
    const container = document.getElementById(
        `exibeGruposMuscularesFicha_${indiceTreino}`
    );
    if (!container) {
        return [];
    }
    const checkboxes = container.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    return [...checkboxes].map(checkbox => {
        return checkbox.nextElementSibling.textContent.trim();
    });
}

function recuperarTreino(fichaId, letraTreino, indiceTreino) {
    const treino = new Treino(
        `${fichaId}_Treino_${letraTreino}`,
        letraTreino
    );

    treino.gruposMusculares = recuperarGruposMusculares(indiceTreino);
    treino.exercicios = recuperarExerciciosTreino(fichaId, letraTreino);
    return treino;
}

function recuperarFicha() {
    const campoId = document.getElementById('campoIDCadastroFicha');
    const dataInicio = document.getElementById('campoDataInicioFicha');
    const dataConclusao = document.getElementById('campoDataConclusaoFicha');
    const qtdTreinos = Number(document.getElementById('campoQtdTreinosFicha').value);

    const ficha = new Ficha( campoId.value, dataInicio.value, dataConclusao?.value || null );

    for (let i = 0; i < qtdTreinos; i++) {
        const letraTreino = letrasTreinos[i];
        const treino = recuperarTreino( ficha.id, letraTreino, i );
        ficha.adicionarTreino(treino);
    }
    return ficha;
}

function salvarFicha() {
    const ficha = recuperarFicha();
    arrayFichas.push(ficha);

    localStorage.setItem('cadastroFicha', JSON.stringify(arrayFichas));

    arrayIdsUtilizados[2].push(ficha.id);
    localStorage.setItem('idsUtilizados', JSON.stringify(arrayIdsUtilizados)
    );

    alert('A ficha foi salva com sucesso!');
}

function populaFichasAbertas(idCampo) {
    const campoExibicaoFichasAbertas = document.getElementById(idCampo);

    if (!campoExibicaoFichasAbertas) {
        console.error(`Campo não encontrado: ${idCampo}`);
        return;
    }

    campoExibicaoFichasAbertas.innerHTML = '';

    const fichasAbertas = arrayFichas.filter(ficha => ficha.dataConclusao === null);

    if (fichasAbertas.length === 0) {
        campoExibicaoFichasAbertas.innerHTML = `
            <div class="alert alert-danger text-center uppercase tamanho09"
            data-aos="fade-left"
            data-aos-duration="2000">
                <i class="fa-solid fa-circle-exclamation"></i>
                &nbsp;&nbsp;
                Nenhuma ficha de treinamento aberta encontrada.
            </div>
        `;
        return;
    }

    fichasAbertas.forEach((ficha) => {
        const indiceFicha = arrayFichas.indexOf(ficha);
        let qtdExercicios = 0;

        for (let j = 0; j < ficha.treinos.length; j++) {
            qtdExercicios += ficha.treinos[j].exercicios.length;
        }

        campoExibicaoFichasAbertas.innerHTML += `
            <div class="row my-3"
            data-aos="fade-right"
            data-aos-duration="2000">
                <div class="col">
                    <div class="card">
                        <span class="mostradorIdFicha uppercase tamanho09">
                            ${ficha.id}
                        </span>

                        <div class="card-header">
                            <div class="row mt-3">
                                <div class="col">
                                    <label class="labelText fw-bold text-danger tamanho09">
                                        início
                                    </label>

                                    <span class="uppercase tamanho09">
                                        ${formatarDataBR(ficha.dataInicio)}
                                    </span>
                                </div>

                                <div class="col-auto">
                                    <label class="labelText fw-bold text-danger tamanho09">
                                        treinos
                                    </label>

                                    <span class="uppercase tamanho09">
                                        ${ficha.treinos.length}
                                    </span>
                                </div>

                                <div class="col">
                                    <label class="labelText fw-bold text-danger tamanho09">
                                        Exercícios
                                    </label>

                                    <span class="uppercase tamanho09">
                                        ${qtdExercicios}
                                    </span>
                                </div>

                                <div class="col-auto flexCenter gap-2">
                                    <button
                                        class="btn btn-sm btn-dark"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#bodyExibicaoExercicioFichaAbertas_${ficha.id}"
                                        id="${ficha.id}_eye"
                                        onclick=" exibeTreinosExercicios(
                                                'bodyExibicaoExercicioFichaAbertas_${ficha.id}',
                                                '${indiceFicha}')">
                                        <i class="fa fa-eye"></i>
                                    </button>

                                   <button class="btn btn-sm btn-success" 
                                   onclick="confirmaConclusaoFicha('${ficha.id}')">
                                        <i class="fa-solid fa-check-double"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="row my-3">
                            <div
                                class="col collapse"
                                id="bodyExibicaoExercicioFichaAbertas_${ficha.id}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        console.log(`${ficha.id}`)
    });
}

function populaFichasConcluidas(idCampo) {
    const campoExibicaoFichasConcluidas = document.getElementById(idCampo);

    if (!campoExibicaoFichasConcluidas) {
        console.error(`Campo não encontrado: ${idCampo}`);
        return;
    }

    campoExibicaoFichasConcluidas.innerHTML = '';

    const fichasConcluidas = arrayFichas.filter( ficha => ficha.dataConclusao !== null);

    if (fichasConcluidas.length === 0) {
        campoExibicaoFichasConcluidas.innerHTML = `
            <div class="alert alert-danger text-center uppercase tamanho09"
            data-aos="fade-left"
            data-aos-duration="2000">
                <i class="fa-solid fa-circle-exclamation"></i>
                &nbsp;&nbsp;
                Nenhuma ficha de treinamento concluída encontrada.
            </div>
        `;
        return;
    }

    fichasConcluidas.forEach((ficha) => {
        const indiceFicha = arrayFichas.indexOf(ficha);
        let qtdExercicios = 0;

        for (let j = 0; j < ficha.treinos.length; j++) {
            qtdExercicios += ficha.treinos[j].exercicios.length;
        }

        campoExibicaoFichasConcluidas.innerHTML += `
            <div class="row my-3">
                <div class="col">
                    <div class="card">
                        <span class="mostradorIdFicha uppercase tamanho09">
                            ${ficha.id}
                        </span>
                        <div class="card-header">
                            <div class="row mt-3">
                                <div class="col-auto">
                                    <label class="labelText fw-bold text-success tamanho09">
                                        início
                                    </label>
                                    <span class="uppercase tamanho09">
                                        ${formatarDataBR(ficha.dataInicio)}
                                    </span>
                                </div>

                                <div class="col-auto">
                                    <label class="labelText fw-bold text-success tamanho09">
                                        conclusão
                                    </label>
                                    <span class="uppercase tamanho09">
                                        ${formatarDataBR(ficha.dataConclusao)}
                                    </span>
                                </div>

                                <div class="col-auto">
                                    <label class="labelText fw-bold text-success tamanho09">
                                        treinos
                                    </label>
                                    <span class="uppercase tamanho09">
                                        ${ficha.treinos.length}
                                    </span>
                                </div>

                                <div class="col-auto">
                                    <label class="labelText fw-bold text-success tamanho09">
                                        Exerc.
                                    </label>
                                    <span class="uppercase tamanho09">
                                        ${qtdExercicios}
                                    </span>
                                </div>

                                <div class="col-auto flexCenter gap-1">
                                    <button class="btn btn-sm btn-dark"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#bodyExibicaoExercicioFichaConcluidas_${ficha.id}"
                                        onclick=" exibeTreinosExercicios(
                                                'bodyExibicaoExercicioFichaConcluidas_${ficha.id}',
                                                '${indiceFicha}')">
                                        <i class="fa fa-eye"></i>
                                    </button>

                                    <button class="btn btn-sm btn-primary" 
                                    onclick="confirmaReabrirFicha('${ficha.id}')">
                                        <i class="fa fa-hourglass"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="row my-3">
                            <div
                                class="col collapse"
                                id="bodyExibicaoExercicioFichaConcluidas_${ficha.id}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function exibeTreinosExercicios(idCampo, indice) {
    const campoExibicao = document.getElementById(idCampo);

    if (!campoExibicao) {
        console.error('Campo de exibição não encontrado:', idCampo);
        return;
    }

    campoExibicao.innerHTML = '';

    const ficha = arrayFichas[indice];

    if (!ficha) {
        console.error('Ficha não encontrada no índice:', indice);
        return;
    }

    ficha.treinos.forEach((treino, i) => {
        const idCollapse = `cardBodyCollapse_Ficha_${ficha.id}_Treino_${treino.letra}`;
        const idExercicios = `cardBody_Ficha_${ficha.id}_Treino_${treino.letra}`;
        const idChevron = `chevronTreino_Ficha_${ficha.id}_Treino_${treino.letra}`;

        campoExibicao.insertAdjacentHTML('beforeend', `
            <div class="card mb-3 m-auto" style="max-width: 95%"
            id="cardHeaderFicha_${ficha.id}_Treino_${treino.letra}">
                <div class="card-header bg-success"
                data-aos="fade-up"
                data-aos-duration="500">
                    <div class="row">
                        <div class="col">
                            <i class="fa fa-star text-warning"></i> &nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="uppercase tamanho09 fw-bold text-light">
                                Treino - Ficha ${treino.letra}
                            </span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-sm btn-dark"
                                data-bs-toggle="collapse"
                                data-bs-target="#${idCollapse}"
                                id="chevronAberto_${ficha.id}_Treino_${treino.letra}"
                                onclick="exibeExerciciosFichaAberta(
                                    '${idExercicios}',
                                    ${indice},
                                    ${i}); mudaChevron('${idChevron}');">
                                <i class="fa fa-chevron-down" id="${idChevron}"> </i>
                            </button>

                            <button
                                type="button"
                                class="btn btn-sm btn-danger"
                                onclick=" confirmaConclusaoTreino(
                                        '${ficha.id}',
                                        '${treino.letra}')">
                                <i class="fa-solid fa-thumbs-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body collapse" id="${idCollapse}">
                    <div class="row" id="${idExercicios}"> </div>
                </div>
            </div>
        `);
    });
}

function confirmaConclusaoTreino(idFicha, letraTreino) {

    const ficha = arrayFichas.find(ficha => ficha.id === String(idFicha));

    if (!ficha) {
        alert('Ficha não encontrada!');
        return;
    }

    const treino = ficha.treinos.find(
        treino => treino.letra === String(letraTreino)
    );

    if (!treino) {
        alert('Treino não encontrado!');
        return;
    }

    const hoje = new Date();

    const dataAtual =
        `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    /*
     * Verifica se este é o último treino da ficha
     */
    const indiceTreino = ficha.treinos.findIndex(
        treino => treino.letra === String(letraTreino)
    );

    const ehUltimoTreino =
        indiceTreino === ficha.treinos.length - 1;

    let fecharFicha = false;

    /*
     * Se for o último treino, pergunta se deseja
     * encerrar também a ficha.
     */
    if (ehUltimoTreino) {

        fecharFicha = confirm(
            `Você concluiu o último treino da ficha ${ficha.id}.\n\n` +
            `Deseja concluir a ficha inteira?`
        );

    } else {

        fecharFicha = confirm(
            `Deseja também dar baixa em todos os treinos da sua ficha atual?\n\n` +
            `Se escolher SIM, a ficha será encerrada.`
        );
    }

    /*
     * Salva o último treino realizado
     */
    const registroUltimoTreino = new TreinoConcluido(
        String(idFicha),
        String(letraTreino),
        dataAtual,
        fecharFicha ? 'concluída' : 'aberta'
    );

    arrayUltimoTreinoConcluido.length = 0;
    arrayUltimoTreinoConcluido.push(registroUltimoTreino);

    localStorage.setItem(
        'ultimoTreinoConcluido',
        JSON.stringify(arrayUltimoTreinoConcluido)
    );

    /*
     * Se o usuário decidiu encerrar a ficha,
     * atualiza a ficha principal.
     */
    if (fecharFicha) {

        ficha.dataConclusao = dataAtual;

        localStorage.setItem(
            'cadastroFicha',
            JSON.stringify(arrayFichas)
        );

        alert(
            `Treino ${letraTreino} finalizado com sucesso!\n\n` +
            `Ficha ${idFicha} concluída.\n` +
            `Data: ${formatarDataBR(dataAtual)}`
        );

    } else {

        alert(
            `Treino ${letraTreino} finalizado com sucesso!\n\n` +
            `Ficha: ${idFicha}\n` +
            `Data: ${formatarDataBR(dataAtual)}`
        );
    }

    /*
     * Atualiza a tela
     */
    populaFichasAbertas('bodyExibicaoFichasAbertas');
    populaFichasConcluidas('bodyExibicaoFichasConcluidas');

    exibeProximoTreino();
}
 
function exibeExerciciosFichaAberta(idCampo, indiceFicha, indiceTreino) {
    const campoExibicao = document.getElementById(idCampo);

    campoExibicao.innerHTML = '';

    const ficha = arrayFichas[indiceFicha];
    const treino = ficha.treinos[indiceTreino];

    treino.exercicios.forEach((exercicio, i) => {

        const idEdit = `BTNEDITAR_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;
        const idSave = `BTNSALVAR_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;

        const idIDNome = `INPUTIDEXERCICIO_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;
        const idNome = `INPUTEXERCICIO_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;
        const idSeries = `INPUTSERIES_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;
        const idRepeticoes = `INPUTREPETICOES_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;
        const idCarga = `INPUTCARGA_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}`;

        campoExibicao.innerHTML += `
            <div class="row mb-4" 
            data-aos="fade-up"
            data-aos-duration="1500">

                <!-- INPUT ID EXERCÍCIO -->
                <div class="col d-none">
                    <input  class="form-control" data-bs-toggle="tooltip"
                        title="Exercício: ${exercicio.idExercicio}"
                        value="${exercicio.idExercicio}"
                        id="${idIDNome}" disabled>
                </div>

                <!-- INPUT NOME EXERCÍCIO -->
                <div class="col-12 mb-2">
                    <input  class="form-control" data-bs-toggle="tooltip"
                        title="Exercício: ${exercicio.nomeExercicio}"
                        value="${exercicio.nomeExercicio}"
                        id="${idNome}" disabled>
                </div>

                <!-- INPUT SÉRIES -->
                <div class="col">
                    <input  class="form-control" data-bs-toggle="tooltip"
                        title="Séries: ${exercicio.series}"
                        value="${exercicio.series}"
                        id="${idSeries}" disabled>
                </div>

                <!-- INPUT REPETIÇÕES -->
                <div class="col">
                    <input  class="form-control" data-bs-toggle="tooltip"
                        title="Repetições: ${exercicio.repeticoes}"
                        value="${exercicio.repeticoes}"
                        id="${idRepeticoes}" disabled>
                </div>

                <!-- INPUT CARGA -->
                <div class="col">
                    <input  class="form-control" data-bs-toggle="tooltip"
                        title="Carga: ${exercicio.carga} Kg"
                        value="${exercicio.carga}"
                        id="${idCarga}" disabled>
                </div>

                <!-- BOTÕES -->
                <div class="col-auto">

                    <!-- EDITAR -->
                    <button  class="btn btn-sm btn-primary" id="${idEdit}"
                        onclick="alternaBtnSaveEditVarios(
                            'editar',
                            '${idEdit}',
                            '${idSave}',
                            '${idNome}',
                            '${idSeries}',
                            '${idRepeticoes}',
                            '${idCarga}')">
                        <i class="fa fa-edit"></i>
                    </button>

                    <!-- SALVAR -->
                    <button  class="btn btn-sm btn-success d-none" id="${idSave}"
                        onclick="atualizarDadosExerciciosArray(
                            ${indiceFicha},
                            ${indiceTreino},
                            ${i},
                            '${idEdit}',
                            '${idSave}',
                            '${idNome}',
                            '${idSeries}',
                            '${idRepeticoes}',
                            '${idCarga}')">
                        <i class="fa fa-save"></i>
                    </button>

                    <!-- EXCLUIR -->
                    <button 
                        class="btn btn-sm btn-danger"
                        id="BTNEXCLUIR_ficha_${ficha.id}_Treino_${treino.letra}_Exercicio_${i}">
                            <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>

            <hr>
        `;
    });
}

function alternaBtnSaveEditVarios(
    escolha,
    idEdit,
    idSave,
    idNomeExercicio,
    idSeries,
    idRepeticoes,
    idCarga
) {
    const btnEdit = document.getElementById(idEdit);
    const btnSave = document.getElementById(idSave);
    const inputNome = document.getElementById(idNomeExercicio);
    const inputSeries = document.getElementById(idSeries);
    const inputRepeticoes = document.getElementById(idRepeticoes);
    const inputCarga = document.getElementById(idCarga);

    if (escolha === 'editar') {
        btnEdit.classList.add('d-none');
        btnSave.classList.remove('d-none');

        inputNome.disabled = false;
        inputSeries.disabled = false;
        inputRepeticoes.disabled = false;
        inputCarga.disabled = false;
    }
}

function atualizarDadosExerciciosArray(
    indiceFicha,
    indiceTreino,
    indiceExercicio,
    idEdit,
    idSave,
    idNomeExercicio,
    idSerie,
    idRepeticao,
    idCarga
) {

    const btnEdit = document.getElementById(idEdit);
    const btnSave = document.getElementById(idSave);
    const inputNomeExercicio = document.getElementById(idNomeExercicio);
    const inputSeries = document.getElementById(idSerie);
    const inputRepeticoes = document.getElementById(idRepeticao);
    const inputCarga = document.getElementById(idCarga);

    const nomeExercicio = inputNomeExercicio.value.trim();
    const series = inputSeries.value;
    const repeticoes = inputRepeticoes.value;
    const carga = inputCarga.value;

    if (
        nomeExercicio === '' || series === '' || repeticoes === '' || carga === '') {
        alert('Insira valores em todos os campos antes de salvar!');
        return;
    }

    if (!arrayFichas[indiceFicha]) {
        console.error('Ficha não encontrada:',indiceFicha);
        return;
    }

    if (!arrayFichas[indiceFicha].treinos[indiceTreino]) {
        console.error('Treino não encontrado:',indiceTreino);
        return;
    }

    const exercicio =
        arrayFichas[indiceFicha]
            .treinos[indiceTreino]
            .exercicios[indiceExercicio];

    if (!exercicio) {console.error('Exercício não encontrado:',indiceExercicio);
        return;
    }

    exercicio.nomeExercicio = nomeExercicio;
    exercicio.series = Number(series);
    exercicio.repeticoes = Number(repeticoes);
    exercicio.carga = Number(carga);

    localStorage.setItem('cadastroFicha',JSON.stringify(arrayFichas));

    inputNomeExercicio.disabled = true;
    inputSeries.disabled = true;
    inputRepeticoes.disabled = true;
    inputCarga.disabled = true;

    btnSave.classList.add('d-none');
    btnEdit.classList.remove('d-none');

    alert(`EXERCÍCIO: ${nomeExercicio}\nSÉRIES: ${series}\nREPETIÇÕES: ${repeticoes}\nCARGA: ${carga}\n\nAtualizado com sucesso !`);
}

function confirmaConclusaoFicha(idFicha) {
    let indice = -1;

    for (let i = 0; i < arrayFichas.length; i++) {
        if (arrayFichas[i].id === idFicha) {
            indice = i;
            break;
        }
    }

    if (indice === -1) {
        alert('Ficha não encontrada!');
        return;
    }

    const confirmar = confirm(`Deseja concluir a ficha ${idFicha}?`);

    if (!confirmar) {
        return;
    }

    arrayFichas[indice].dataConclusao = new Date().toISOString().split('T')[0];

    localStorage.setItem('cadastroFicha',JSON.stringify(arrayFichas));
    alert('Ficha concluída com sucesso!');

    populaFichasAbertas('bodyExibicaoFichasAbertas');
    populaFichasConcluidas('bodyExibicaoFichasConcluidas');
}

function confirmaReabrirFicha(idFicha) {
    const indice = arrayFichas.findIndex(ficha => ficha.id === idFicha);

    if (indice === -1) {
        alert('Ficha não encontrada!');
        return;
    }

    if (arrayFichas[indice].dataConclusao === null) {
        alert('Esta ficha já está aberta!');
        return;
    }

    arrayFichas[indice].dataConclusao = null;

    localStorage.setItem('cadastroFicha',JSON.stringify(arrayFichas));

    alert(`Ficha ${idFicha} reaberta com sucesso!`);

    populaFichasAbertas('bodyExibicaoFichasAbertas');
    populaFichasConcluidas('bodyExibicaoFichasConcluidas');
}

function exibeProximoTreino() {

    const campoExibicao = document.getElementById('alertProximoTreino');

    if (!campoExibicao) {
        return;
    }

    campoExibicao.innerHTML = '';

    if (
        !Array.isArray(arrayUltimoTreinoConcluido) ||
        arrayUltimoTreinoConcluido.length === 0
    ) {

        const fichaAberta = arrayFichas.find(
            ficha => ficha.dataConclusao === null
        );

        if (!fichaAberta || fichaAberta.treinos.length === 0) {

            campoExibicao.innerHTML = `
                <div class="col">
                    <div class="alert alert-warning text-center">
                        <span class="uppercase tamanho09">
                            Nenhum treino disponível.
                        </span>
                    </div>
                </div>
            `;

            return;
        }

        const primeiroTreino = fichaAberta.treinos[0];

        campoExibicao.innerHTML = `
            <div class="col">
                <div class="alert alert-success text-center">

                    <div class="row">

                        <div class="col">
                            <h6 class="uppercase">
                                ficha de treinamento de hoje:
                            </h6>
                        </div>

                        <div class="row m-auto">
                            <div class="col">

                                <button
                                    class="btn btn-primary w-100 py-2"
                                    onclick="exibeTreinoDoDia('${fichaAberta.id}', '${primeiroTreino.letra}')"


                                    <div class="row">

                                        <div class="col-12">
                                            <span class="uppercase tamanho10">
                                                treino - letra ${primeiroTreino.letra}
                                            </span>
                                        </div>

                                        <div class="col-12 mt-1">
                                            <span class="uppercase tamanho08">
                                                (clique para ver os exercícios)
                                            </span>
                                        </div>

                                    </div>

                                </button>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        `;

        return;
    }

    /*
     * Recupera o último treino realizado
     */
    const ultimoTreino = arrayUltimoTreinoConcluido[0];

    const fichaId = String(ultimoTreino.idFicha);
    const ultimaLetra = String(ultimoTreino.letraFichaTreino);
    
    const ficha = arrayFichas.find(
        ficha => String(ficha.id) === fichaId
    );

    if (!ficha) {

        campoExibicao.innerHTML = `
            <div class="col">
                <div class="alert alert-danger text-center">
                    Ficha do último treino não encontrada.
                </div>
            </div>
        `;

        return;
    }

    const indiceUltimoTreino = ficha.treinos.findIndex(
        treino => treino.letra === ultimaLetra
    );

    if (indiceUltimoTreino === -1) {

        campoExibicao.innerHTML = `
            <div class="col">
                <div class="alert alert-danger text-center">
                    Treino ${ultimaLetra} não encontrado na ficha ${fichaId}.
                </div>
            </div>
        `;

        return;
    }

    const indiceProximoTreino = indiceUltimoTreino + 1;

    if (indiceProximoTreino >= ficha.treinos.length) {

        campoExibicao.innerHTML = `
            <div class="col">
                <div class="alert alert-info text-center">

                    <div class="row">

                        <div class="col-12">
                            <h6 class="uppercase">
                                ficha de treinamento
                            </h6>
                        </div>

                        <div class="col-12">
                            <span class="uppercase tamanho09">
                                Você concluiu todos os treinos da ficha ${fichaId}.
                            </span>
                        </div>

                    </div>

                </div>
            </div>
        `;

        return;
    }

    /*
     * Próximo treino encontrado
     */
    const proximoTreino = ficha.treinos[indiceProximoTreino];

    campoExibicao.innerHTML = `
        <div class="col">
            <div class="alert alert-success text-center"
            data-aos="zoom-in-down"
            duration: 2000>

                <div class="row">

                    <div class="col">
                        <h6 class="uppercase">
                            ficha de treinamento de hoje:
                        </h6>
                    </div>

                    <div class="row m-auto">

                        <div class="col">

                            <button
                                class="btn btn-primary w-100 py-2"
                                onclick="exibeTreinoDoDia('${fichaId}', '${proximoTreino.letra}')"


                                <div class="row">

                                    <div class="col-12">
                                        <span class="uppercase tamanho10">
                                            treino - letra ${proximoTreino.letra}
                                        </span>
                                    </div>

                                    <div class="col-12 mt-1">
                                        <span class="uppercase tamanho08">
                                            (clique para ver os exercícios)
                                        </span>
                                    </div>

                                </div>

                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    `;
}

function exibeTreinoDoDia(fichaId, letraTreino) {

    const minhaFicha = document.getElementById(
        'minhaFichaTreinamento'
    );

    const fichasAbertas = document.getElementById(
        'btnFichasAbertas'
    );

    if (minhaFicha) {
        minhaFicha.click();
    }

    if (fichasAbertas) {
        fichasAbertas.click();
    }

    setTimeout(() => {

        const botaoFicha = document.getElementById(
            `${fichaId}_eye`
        );

        if (!botaoFicha) {
            console.error('Botão da ficha não encontrado:', `${fichaId}_eye`);
            return;
        }

        botaoFicha.click();

        setTimeout(() => {

            const botaoTreino = document.getElementById(
                `chevronAberto_${fichaId}_Treino_${letraTreino}`
            );


            if (!botaoTreino) {
                console.error(
                    'Botão do treino não encontrado:',
                    `chevronAberto_${fichaId}`
                );
                return;
            }

            botaoTreino.click();

            setTimeout(() => {const elementoParaScroll = document.getElementById(
                    `cardHeaderFicha_${fichaId}_Treino_${letraTreino}`
                );

                if (!elementoParaScroll) {
                    console.error(
                        'Elemento para scroll não encontrado:',
                        `cardHeaderFicha_${fichaId}_Treino_${letraTreino}`
                    );
                    return;
                }

                elementoParaScroll.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }, 300);

        }, 300);

    }, 300);
}


