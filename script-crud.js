const btnSaveTask = document.querySelector('.app__button--add-task')
const btnCancelTask = document.querySelector('.app__form-footer__button--cancel')
const btnDeleteTask = document.querySelector('.app__form-footer__button--delete')
const formAddTask = document.querySelector('.app__form-add-task')
const textarea = document.querySelector('.app__form-textarea')
const ulTasks = document.querySelector('.app__section-task-list')
const allLiTasks = document.querySelectorAll('.app__section-task-list-item')
const sectionActiveTask = document.querySelector('.app__section-active-task-description')
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

let tasks = JSON.parse(localStorage.getItem('tasksKey')) || [] //lista de tarefas
let taskSelected = null
let liTaskSelected = null

function updateTask () {
    localStorage.setItem('tasksKey', JSON.stringify(tasks))
} 

function newTask(task){
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `

    const paragrafo = document.createElement('p')
    paragrafo.classList.add('app__section-task-list-item-description')
    paragrafo.textContent = task.description

    const btnEditTask = document.createElement('button')
    btnEditTask.classList.add('app_button-edit')
    btnEditTask.onclick = () => {
        const editedTask = prompt('Qual é a nova tarefa?')
        if (editedTask){
            paragrafo.textContent = editedTask
            task.description = editedTask
            updateTask()
        } 
    }

    const imagemDoBotao = document.createElement('img')
    imagemDoBotao.setAttribute('src', '/imagens/edit.png')
    btnEditTask.append(imagemDoBotao)

    li.append(svg)
    li.append(paragrafo)
    li.append(btnEditTask)

    if(task.complete){
        li.classList.add('app__section-task-list-item-complete')
        btnEditTask.setAttribute('disabled', 'disabled')
    }else{
        li.onclick = () =>{
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(element =>{
                    element.classList.remove('app__section-task-list-item-active')
                })
            if(taskSelected == task){
                sectionActiveTask.textContent = ''
                taskSelected = null
                liTaskSelected = null
                return
            }
            taskSelected = task
            liTaskSelected = li
            sectionActiveTask.textContent = task.description
    
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li
}

btnSaveTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden')
})

btnCancelTask.addEventListener('click', () => {
    formAddTask.classList.add('hidden')
})

formAddTask.addEventListener('submit', (evento) => {
    evento.preventDefault();//previne o comportamento padrão de reiniciar a página quando é dado o submit
    const task = {
        description: textarea.value
    }
    tasks.push(task)
    const TaskElement = newTask(task)
    ulTasks.append(TaskElement)
    updateTask()
    textarea.value = ''
    formAddTask.classList.add('hidden')
})

tasks.forEach(task => {
    const taskElement = newTask(task)
    ulTasks.append(taskElement)
});

document.addEventListener('focoFinalizado', () => {
    if(taskSelected && liTaskSelected){
        liTaskSelected.classList.remove('app__section-task-list-item-active')
        liTaskSelected.classList.add('app__section-task-list-item-complete')
        liTaskSelected.querySelector('button').setAttribute('disabled', 'disabled')
        taskSelected.complete = true
        updateTask()
    }
})

const removeTasks = (onlycompleted) =>{
    const seletor = onlycompleted ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tasks = onlycompleted ? tasks.filter(task => !task.complete) : []
    updateTask()
}

btnRemoverConcluidas.onclick = () => removeTasks(true)
btnRemoverTodas.onclick = () => removeTasks(false)