
const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class='btn'>${el}</span>`);
    return (htmlElements.json(''));
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all') // promise of response

    .then(res => res.json()) // promise of json data
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
    const lessonBtn = document.querySelectorAll('.lesson-btn');
    lessonBtn.forEach((btn) => btn.classList.remove('active'));
}

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActive(); // remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        clickBtn.classList.add('active'); // add active class
        displayLevelWord(data.data);
    });
};

const loadWordDetail = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
    console.log(word)
    const detailsContainer = document.getElementById('details-container');

    detailsContainer.innerHTML = `
    <div class="border-2 border-[#EDF7FF] rounded-xl p-4 mb-4">
            <h2 class="font-bangla text-[36px] font-semibold">${word.word} ( <i class="fa-solid fa-microphone-lines mb-[32px]"></i> :${word.pronunciation})</h2>
            <h3 class="text-[24px] font-semibold mb-[10px]">meaning</h3>
            <h4 class="font-bangla text-[24px] font-medium mb-[32px]">${word.meaning}</h4>
            <h3 class="font-bangla text-[24px] font-semibold mb-[10px]">Example</h3>
            <p class="text-[24px] font-normal mb-[32px]">${word.sentence}</p>
            <h4 class="font-bangla text-[24px] font-medium mb-[10px]">সমার্থক শব্দ গুলো</h4>
            <div class="">
              <button class="btn bg-[#EDF7FF] py-2 px-3 border-1 border-gray-200 rounded-lg mr-2">Enthusiastic</button>
              <button class="btn bg-[#EDF7FF] py-2 px-3 border-1 border-gray-200 rounded-lg mr-2">excited</button>
              <button class="btn bg-[#EDF7FF] py-2 px-3 border-1 border-gray-200 rounded-lg">keen</button>
            </div>
          </div>
          <button class="btn btn-primary rounded-xl">Complete Learning</button>
    `;

    document.getElementById('word_modal').showModal();
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full">
            <img class="mx-auto mb-[15px]" src="./assets/alert-error.png" alt="">
            <p class="font-bangla text-[15px] mb-[12px]"> এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bangla text-[34px]">নেক্সট Lesson এ যান!</h2>
         </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach((word) => {
        const card = document.createElement('div');
        console.log(word)
        card.innerHTML = `
        <div class="px-5 py-10 text-center bg-white shadow-sm rounded-xl mb-8 md:mb-0">
            <h2 class="text-[32px] font-bold mb-[24px]">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="text-[20px] font-medium mb-[24px]">Meaning /Pronounciation</p>
            <div class="font-bangla text-[32px] font-semibold">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}"</div>
            <div class="flex items-center justify-between text-center px-[47px] py-[36px]">
              <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] py-6 px-4 rounded-xl text-[24px]"><i class="fa-solid fa-circle-info"></i></button>
              <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] py-6 px-4 rounded-xl text-[24px]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>`;
        wordContainer.append(card);
    });
    manageSpinner(false);
};

const displayLesson = (lessons) => {
    
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';

    for (let lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick='loadLevelWord(${lesson.level_no})' href="#" class="btn btn-outline btn-primary lesson-btn mb-5 md:mb-0"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no} </button>
        `;
        levelContainer.append(btnDiv);
    }
};

loadLessons();

document.getElementById('btn-search')
.addEventListener('click', () => {
    removeActive();
    const inputSearch = document.getElementById('input-search');
    const searchValue = inputSearch.value.trim().toLowerCase();
    console.log(searchValue)

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        console.log(allWords);
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    })
})