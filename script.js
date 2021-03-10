/*Words We Like: 
  1. RIEMIDR
  2. CKAISHRIMIA
  3. FLOVIESHRA  
  4. SPREDADA
  5. SHRAI
  6. AISQUIE
  7. SHROFEI
  8. ASPLEE
  9. GEUVEUSHRISTR
  10. SPR
*/

var singvowels = ["A", "E", "I", "O", "U"]
var divowels = ["AI", "AU", "EA", "EE", "EI", "EU", "IA", "IE", "IA", "IE", "OU", "UE"]
var singconsonants = ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "Z"]
var diconsonants = ["BL", "BR", "CH", "CK", "CL", "CR", "DR", "FL", "FR", "GH", "GL", "GR", "NG", "PH", "PL", "PR", "QU", "SC", "SH", "SK", "SL", "SM", "SN", "SP", "ST", "SW", "TH", "TR", "TW", "WH", "WR"]
var triconsonants = ["NTH", "SCH", "SHR", "SPL", "SPR", "SQU", "STR", "THR"]

function findSym(state) {
  //single vowel
  if (state == "q2") {
    return singvowels[Math.floor(Math.random() * singvowels.length)]
  }
  //single consonant
  if (state == "q3") {
    return singconsonants[Math.floor(Math.random() * singconsonants.length)]
  }
  //digraph vowel
  if (state == "q4") {
    return divowels[Math.floor(Math.random() * divowels.length)]
  }
  //digraph consonant
  if (state == "q5") {
    return diconsonants[Math.floor(Math.random() * diconsonants.length)]
  }
  //trigraph consonants
  if (state == "q6") {
    return triconsonants[Math.floor(Math.random() * triconsonants.length)]
  }
}

// q2, q4 -> q3, q5, q6 (vowels to consonants)
// q3, q5, q6 -> q2, q4 (consonants to vowels)

var fsa2 = {
  startState: "q1",
  transitions: [{ state: "q1", sym: findSym("q2"), dest: "q2" }, // single vowels
  { state: "q1", sym: findSym("q3"), dest: "q3" }, // single consonants
  { state: "q1", sym: findSym("q4"), dest: "q4" }, // digraph vowels
  { state: "q1", sym: findSym("q5"), dest: "q5" }, // digraph consonants
  { state: "q1", sym: findSym("q6"), dest: "q6" }, // trigraph consonants

  { state: "q2", sym: findSym("q3"), dest: "q3" }, // single vowel to single consonants
  { state: "q2", sym: findSym("q5"), dest: "q5" }, // single vowel to digraoh consonants
  { state: "q2", sym: findSym("q6"), dest: "q6" }, // single vowel to trigraph consonants

  { state: "q3", sym: findSym("q2"), dest: "q2" }, // single consonants to single vowel
  { state: "q3", sym: findSym("q4"), dest: "q4" }, // single consonant to digraph vowels

  { state: "q4", sym: findSym("q3"), dest: "q3" }, // digraph vowels to single constant 
  { state: "q4", sym: findSym("q5"), dest: "q5" }, // digraph vowel to digraph consonants
  { state: "q4", sym: findSym("q6"), dest: "q6" }, // digraph vowel to trigraph consonants

  { state: "q5", sym: findSym("q2"), dest: "q2" }, // digraph consonants to single vowel
  { state: "q5", sym: findSym("q4"), dest: "q4" }, // digraph consonant to digraph vowels

  { state: "q6", sym: findSym("q2"), dest: "q2" }, // trigraph consonants to single vowel
  { state: "q6", sym: findSym("q4"), dest: "q4" } // trigraph consonant to digraph vowels
  ],
  acceptStates: ["q2", "q3", "q4", "q5", "q6"]
}

// Generates words in an FSA
function generate(fsa) {
  var currentState = fsa.startState; // track our current state
  var word = ""; // word we are generating
  var accept = false; // boolean that lets us continue or exit loop

  do {
    // 0. If current state is accept state, decide if we should accept
    if (fsa.acceptStates.includes(currentState)) { // ask if current state is accept state
      randomAccept = Math.floor(Math.random() * 11) // random number between 0-10
      if ((word.length > 2 && randomAccept > 8) || (word.length > 15)) { // random probability for accepting
        accept = true;
        break; // if decide to accept, don't need to determine transitions, so we can exit loop
      }
    }

    // 1. Get transitions for current state
    var currentTransitions = []; // array of possible transitions for current state
    for (transition of fsa.transitions) { // loop through all transitions in the FSA
      if (transition.state == currentState) { // check state property in each transition
        currentTransitions.push(transition); // add transition to the array
      }
    }

    // 2. Choose a transition randomly
    var numTransitions = currentTransitions.length; // gets length of the array of transitions 
    var randomTransition = Math.floor(Math.random() * numTransitions); // range from 0 to the number of transitions 
    var transition = currentTransitions[randomTransition]; // index the list of current transitions using our random number to choose a transition randomly

    // 3. Emit the letter/symbol on that transition 
    word = word.concat(transition.sym); // get symbol property of transition and concatenate symbol to word

    // 4. Change current state to new state
    currentState = transition.dest;
  }
  while (accept == false); // keep looping if we haven't accepted
  console.log(word); // output the final word
}

// Run program
generate(fsa2);