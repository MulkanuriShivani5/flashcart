const STORAGE_KEY = 'flashcards_v1'

const defaultCards = [
  {q: 'What is Java?', a: 'Java is a high-level, object-oriented programming language.'},
  {q: 'What is DBMS?', a: 'DBMS stands for Database Management System.'},
  {q: 'What is HTML?', a: 'HTML stands for HyperText Markup Language.'},
  {q: 'What is CSS?', a: 'CSS is used to style and design web pages.'},
  {q: 'What is JavaScript?', a: 'JavaScript is a programming language used to make web pages interactive.'}
]

let cards = []
let currentIndex = 0
let showingAnswer = false
let editingIndex = null

// Elements
const questionEl = document.getElementById('question')
const answerEl = document.getElementById('answer')
const toggleBtn = document.getElementById('toggleAnswer')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const cardCounter = document.getElementById('cardCounter')

const cardForm = document.getElementById('cardForm')
const qInput = document.getElementById('qInput')
const aInput = document.getElementById('aInput')
const addBtn = document.getElementById('addBtn')
const cancelEdit = document.getElementById('cancelEdit')
const cardList = document.getElementById('cardList')

function loadCards(){
  const raw = localStorage.getItem(STORAGE_KEY)
  if(!raw){
    cards = defaultCards.slice()
    saveCards()
  } else {
    try{ cards = JSON.parse(raw) }catch(e){ cards = defaultCards.slice(); saveCards(); }
  }
}

function saveCards(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

function renderCard(){
  if(cards.length === 0){
    questionEl.textContent = 'No flashcards yet.'
    answerEl.textContent = ''
    toggleBtn.style.display = 'none'
    cardCounter.textContent = 'Card 0 of 0'
    prevBtn.disabled = true; nextBtn.disabled = true
    return
  }

  const c = cards[currentIndex]
  questionEl.textContent = c.q
  answerEl.textContent = c.a
  answerEl.style.display = showingAnswer ? 'block' : 'none'
  toggleBtn.style.display = 'inline-block'
  toggleBtn.textContent = showingAnswer ? 'Hide Answer' : 'Show Answer'

  cardCounter.textContent = `Card ${currentIndex+1} of ${cards.length}`
  prevBtn.disabled = currentIndex === 0
  nextBtn.disabled = currentIndex === cards.length-1
}

function renderList(){
  cardList.innerHTML = ''
  cards.forEach((c, idx) => {
    const li = document.createElement('li')
    const meta = document.createElement('div')
    meta.className = 'meta'
    const q = document.createElement('div')
    q.className = 'q'
    q.textContent = c.q
    const a = document.createElement('div')
    a.className = 'a'
    a.textContent = c.a
    meta.appendChild(q)
    meta.appendChild(a)

    const controls = document.createElement('div')
    controls.className = 'controls'
    const edit = document.createElement('button')
    edit.className = 'btn small'
    edit.textContent = 'Edit'
    edit.addEventListener('click', ()=> startEdit(idx))
    const del = document.createElement('button')
    del.className = 'btn small'
    del.textContent = 'Delete'
    del.addEventListener('click', ()=> deleteCard(idx))
    controls.appendChild(edit)
    controls.appendChild(del)

    li.appendChild(meta)
    li.appendChild(controls)
    cardList.appendChild(li)
  })
}

function startEdit(idx){
  editingIndex = idx
  qInput.value = cards[idx].q
  aInput.value = cards[idx].a
  addBtn.textContent = 'Save'
  cancelEdit.style.display = 'inline-block'
}

function cancelEditing(){
  editingIndex = null
  qInput.value = ''
  aInput.value = ''
  addBtn.textContent = 'Add Flashcard'
  cancelEdit.style.display = 'none'
}

function deleteCard(idx){
  const ok = confirm('Are you sure you want to delete this flashcard?')
  if(!ok) return
  cards.splice(idx,1)
  if(currentIndex >= cards.length) currentIndex = Math.max(0, cards.length-1)
  saveCards()
  renderCard()
  renderList()
}

// Event handlers
toggleBtn.addEventListener('click', ()=>{
  showingAnswer = !showingAnswer
  renderCard()
})

prevBtn.addEventListener('click', ()=>{
  if(currentIndex>0){ currentIndex--; showingAnswer=false; renderCard() }
})
nextBtn.addEventListener('click', ()=>{
  if(currentIndex<cards.length-1){ currentIndex++; showingAnswer=false; renderCard() }
})

cardForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const q = qInput.value.trim()
  const a = aInput.value.trim()
  if(!q || !a) return

  if(editingIndex === null){
    cards.push({q,a})
    currentIndex = cards.length-1
  } else {
    cards[editingIndex] = {q,a}
    currentIndex = editingIndex
  }

  saveCards()
  renderCard()
  renderList()
  cancelEditing()
})

cancelEdit.addEventListener('click', ()=> cancelEditing())

function init(){
  loadCards()
  renderList()
  renderCard()
}

init()
