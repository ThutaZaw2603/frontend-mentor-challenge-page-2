////////////////////////////Select DOM_______________________________________________________

const toggleBtn = document.getElementById('burgerIcon'),
navItem     = document.getElementById('phoneitem'),
closeIcon   = document.getElementById('close'),
openIcon    = document.getElementById('open');

const body = document.querySelector('body'),
form = document.querySelector('#linkForm'),
input    = document.querySelector('#linkInput'),
submitBtn  = document.querySelector('#submitBtn'),
output     = document.querySelector('#output'),
li   = output.getElementsByTagName('li'),
error    = document.getElementById('error');

////////////////////////////Toggle Navbar for phone_______________________________________________________

toggleBtn.addEventListener('click',
    ()=>{
        console.log('clci')
        navItem.classList.toggle('show')
        closeIcon.classList.toggle('show1');
        openIcon.classList.toggle('hide')
    }
)

////////////////////////////Start the Shorten _______________________________________________________

//to prevent the submit btn to auto reload the page when clicked
form.addEventListener('submit', (e) => { e.preventDefault(); });

//global variables
let toRemove = 0;
let reloading = 0;
let length = localStorage.length;


//Function A ---> Load function to show at the start of the page  --1

window.addEventListener('load',

    () => {
        firstDisplay();

        //to check if this is the very first time of the page : no data in the lclstrge
        if(localStorage.getItem('lastI') == null)
        {
            console.log('lastI is null')
        }
        else{
            reloading = parseInt(localStorage.getItem('lastI'))
            console.log(reloading)
        }
        
    }
)

//Function A.2 --> to display data at load      --2

function firstDisplay() {

    //this is the first time of the page : no data in the lclstrge
    if (length === 0) {
        console.log('nothing to show');
    }
    //when there is only 2 data in the lclstrge
    else if (length != 0 && length < 6) {
        let minus;
        length === 3 ? minus = 2 : minus = 3;
        for (let i = 0; i < (length - minus); i++) {
            createFirstLi(i);
        }
    }
    //to show every data in the lclstrge
    else {
        let change = parseInt(localStorage.getItem('lastI') - 1);
        for (let j = change; j > (change - 3); j--) //to iterate 3 times
        {
            createFirstLi(j);
        }

    }
}

//Function A.3  --> to create list at the load      --3

function createFirstLi(increment) {
    const liNode = document.createElement('li');

    const p1 = document.createElement('p');
    p1.innerHTML = localStorage.getItem(`short${increment}`);

    const p2 = document.createElement('p');
    p2.innerText = localStorage.getItem(`link${increment}`);

    const btn = document.createElement('button');
    btn.innerHTML = 'Copy';

    btn.addEventListener('click',
            (e)=> {
                btn.style.background = "hsl(257, 27%, 26%)";
                btn.textContent = "copied!"
                copyFun(p1);
            })

    const div = document.createElement('div');
    div.append(p1,btn);
    liNode.append(p2, div);
    output.append(liNode);
   
}

//Function B ---> Submit function when i click submit btn of input      --4

submitBtn.addEventListener('click',
    () => {      
        getData(input.value);
        console.log('it click')
    }
)

//Function B.1 --> to fetch data from api and short the input link      --5 

async function getData(link) {

    try {
            //fetch api
            let data = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`);
            let { result } = await data.json();
            
            //add response data into lclstrge
            localStorage.setItem(`short${reloading}`, result.full_short_link);
            localStorage.setItem(`link${reloading}`, link);

            //create the li with shorted link
            if (li.length > 2) {
                createLi(link);
                li[3].remove();
            }
            else {
                createLi(link);
            }


            //for the reloaded case :lastI is to remember where the lclstrge data is ended before loaded
            localStorage.setItem(`lastI`, reloading.toString());

            //delete the data from lclstrge when there is over 3 links
            if (localStorage.length > 7) {
                toRemove = reloading - 4;
                localStorage.removeItem(`short${toRemove}`);
                localStorage.removeItem(`link${toRemove}`);

            }
            error.style.display = 'none';
            input.classList.remove('border')
    }
    //for invalid link is provided
    catch (err) {
        console.log(err);
        error.style.display = 'block';
        input.classList.add('border')
    }

}

//Function B.2 --> to create li                                     --6

function createLi(link) {
    //li 
    const liNode = document.createElement('li');

    //node 1 : shorten link
    const p1 = document.createElement('p');
    p1.innerHTML = localStorage.getItem(`short${reloading}`);

    //node 2 : original link
    const p2 = document.createElement('p');
    p2.innerHTML = link;

    //node 3 : copy btn
    const btn = document.createElement('button');
    btn.innerHTML = 'Copy';

    //node 4 : div to node2 and node 3
    const div = document.createElement('div');
    div.append(p1,btn);
    btn.addEventListener('click',
    ()=> {
        btn.style.background = "hsl(257, 27%, 26%)";
        btn.textContent = "copied!"
        copyFun(p1);
    })


    liNode.append(p2, div);
    output.insertBefore(liNode, output.childNodes[0]);

    //clear the input field after submitted
    input.value = "";
    reloading++;

}

//Function B.3 --> to copy the shorten link                         --7

function copyFun(p1) {

    //to be able to copy we need to create textarea
    const area = document.createElement('textarea');
    body.appendChild(area);
    area.value = p1.innerText;
    area.select();

    //check for browser privacy
    if (window.isSecureContext == true) {
        navigator.clipboard.writeText(area.value)   //Clipboard Web API 
        .then(() => { console.log('success'); }); 
    }
    else {
        document.execCommand('copy'); // execCommand Web API : no-longer supported
        console.log('this is with execCommand');
    }

    area.style.display = 'none';

}
