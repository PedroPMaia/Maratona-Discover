// as chaves é a definição de um novo objeto: propriedades e funcionalidades //
            // conseguem também definir um novo escopo
            // Quando uma função está dentro de um objeto, chama-se método pois está dentro do objeto que não deixa de ser uma função
            const Modal = {
                open(){
                     // passo a passo de maneira logica/algortimo
                     // Abrir modal
                     // Adicionar a class active ao modal
                     // DOM é modelo de toda estrutura HTML passada para o JavaScript, quem cria é o browser
                     document
                     .querySelector('.modal-overlay') //Argumento que irá retornar um objeto - funcionalidade em que ordena o JS a pesquisar em todo o documento e selecionar o "modal-overlay"
                     .classList // Lista de classe após ter sido selecionado
                     .add('active') // Adicionar a lista de classe do modal-overlay que está no nosso documento
                },
                close(){
                    // Fechar modal
                    // remover a class active do modal
                    document
                     .querySelector('.modal-overlay') //Argumento que irá retornar um objeto - funcionalidade em que ordena o JS a pesquisar em todo o documento e selecionar o "modal-overlay"
                     .classList
                     .remove('active') // Remover a lista de classe do modal-overlay que está no nosso documento
                }
            }

            const Storage = {
                // Pegar as informações, no caso as infos de Transactions através do set
                get() {
                    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || 
                    []
                },
            
                set(transactions) {
                    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
                }
            }

            const Transaction = { // = significa atribuir valor, ou seja, atribuir para dentro da variável
                all: Storage.get(),

                add(transaction){
                    Transaction.all.push(transaction)

                    App.reload()
                },

                remove(index) {
                    Transaction.all.splice(index, 1)

                    App.reload()
                },

                incomes() {
                    let income = 0;
                    // pegar todas as transações
                    // para cada transacao, 
                    Transaction.all.forEach(transaction => {
                        // se for > 0
                        if( transaction.amount > 0) {
                            // somar a uma variaval e retornar a variavel
                        income += transaction.amount;
                        }
                    })
                    return income;
                },
                expenses() {
                    let expense = 0;
                    // pegar todas as transações
                    // para cada transacao, 
                    Transaction.all.forEach(transaction => {
                    // se for > 0
                    if( transaction.amount < 0) {
                        // somar a uma variaval e retornar a variavel
                        expense += transaction.amount;
                        }
                    })
                    return expense;  
                },
                total() {
                    return Transaction.incomes() + Transaction.expenses();
                    //Total é a subtração = entrada - saída. Colocamos o sinal de + acima, devido a já termos a varíavel negativo guardado
                }
            }
            
// Substituir os dados do HTML com os dados do JS


// DOM (modelo de objeto de documento) = É o HTML convertido para um Objeto JavaScript; API que representa e interage com HTML; JavaScript usa um DOM para se conectar ao HTML; * Manipular o HTML com JavaScript

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index) {
        // console.log(transaction)
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        // console.log(tr.innerHTML)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
        innerHTMLTransaction(transaction, index) { // innerHTMLTransaction = HTML interno de uma transção, uma funcionalidade
            
            const CSSclass = transaction.amount > 0 ? "income" : "expense"
            
            // ? = então coloque a classe income : (senao) coloque a classe expense

            const amount = Utils.formatCurrency(transaction.amount)
            
            const html = `    
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html // O DOM.innerHTML captura este retorno, e depois entrega ao tr.innerHTML
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = value * 100

        return Math.round(value)
        // console.log(value)
    },

    formatDate(date) {
        // split: separar, aplicável a strings .. Separador a procurar
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        // O return acima faz com que haja a transformação em string, e também sua inversão e formatar a data na maneira que precisaremos
        //console.log(splittedDate)
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        // Irá transformar o número numa string
        // Regex - Expressao regular - /\D/g - Ache e retire tudo que não seja número

        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
        const description = Form.getValues().description
        const amount = Form.getValues().amount
        const date = Form.getValues().date
        
        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ) {
                throw new Error("Por favor, é necessário preencher todos os campos")
                //capturar o erro
           }
        //console.log(Form.getValues())
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return { 
            // shorthand = abreviação
            // Quando o nome da chave de retorno é o mesmo nome da variável, nao precisa repetir e pode usar o shorhand
            description,
            amount,
            date
        }

        // console.log() - Para testar algum dos objetos acima, basta informar o obj
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },


    submit(event) {
        event.preventDefault()

        try {
            // Validação dos campos
            Form.validateFields()
            // Formatar os dados para salvar
            const transaction = Form.formatValues()
            Form.formatValues()
            // Salvar
            Transaction.add(transaction)
            // Apagado, para que seja possível a colocação de uma nova transação
            Form.clearFields()
            // Modal feche
            Modal.close()
            // Atualizar a aplicação
        } catch (error) {
            /* capturar qualquer erro que for disparado pelo throw */
            alert(error.message)
        }
        // Verificar se todas as informações foram preenchidas
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => /* argumento = transação do momento */ {
            DOM.addTransaction(transaction, index)
        })
        //forEach: para cada elemento executar uma funcionalidade.
        
        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()


