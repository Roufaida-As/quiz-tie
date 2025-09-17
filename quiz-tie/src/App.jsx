import { useState, useEffect } from 'react';

const questions = [
  {
    id: 1,
    text: "Si tu vas à la bib pendant la semaine des exams, tu verras plus de zombies que d'étudiants vivants.",
    isTrue: true,
    explanation: "La bibliothèque pendant les exams ressemble vraiment à un film d'horreur !"
  },
  {
    id: 2,
    text: "Y'a pas de journée libre à part les weekend.",
    isTrue: true,
    explanation: "Bienvenue à l'ESI, où les journées de repos sont un mythe !"
  },
  {
    id: 3,
    text: "Lbourak ta3 3ami 3bdel9ader is the best",
    isTrue: true,
    explanation: "Une vérité universelle reconnue par tous les étudiants ESI !"
  },
  {
    id: 4,
    text: "Les TP d'ALSDS durent parfois jusqu'à 3h du matin!",
    isTrue: true,
    explanation: "Les longues soirées TP font partie de l'expérience ESI !"
  },
  {
    id: 5,
    text: "Le distributeur de café de l'ESI a sa propre personnalité",
    isTrue: true,
    explanation: "Il refuse de fonctionner pendant les exams, quand vous en avez le plus besoin !"
  },
  {
    id: 6,
    text: "Les étudiants finissent par rêver en syntaxe d'algorithmes",
    isTrue: true,
    explanation: "'Si je me réveille ALORS café SINON dormir encore' devient naturel !"
  },
  {
    id: 7,
    text: "On apprend plus de langages de programmation qu'on n'apprend de langues étrangères",
    isTrue: true,
    explanation: "C, Java, Python, JavaScript, Assembly... la tour de Babel informatique !"
  },
  {
    id: 8,
    text: "Faire marcher son code du premier coup est suspect",
    isTrue: true,
    explanation: "Si ça marche direct, c'est qu'il y a forcément un bug caché quelque part !"
  },
  {
    id: 9,
    text: "On ne dort jamais.",
    isTrue: false,
    explanation: "Faux ! On dort... juste très peu et souvent sur le clavier !"
  },
  {
    id: 10,
    text: "Les profs d'analyse utilisent des hiéroglyphes au tableau",
    isTrue: false,
    explanation: "Non, c'est juste de l'écriture normale... très, très artistique !"
  },
  {
    id: 11,
    text: "Il faut un GPS pour naviguer dans l'ESI",
    isTrue: false,
    explanation: "Exagération ! Une boussole suffit largement !"
  },
  {
    id: 12,
    text: "Les étudiants ESI rêvent en binaire",
    isTrue: false,
    explanation: "On rêve en hexadécimal, c'est plus efficace ! 01001000"
  },
  {
    id: 13,
    text: "Les étudiants ESI peuvent déboguer du code en dormant",
    isTrue: false,
    explanation: "Mais c'est notre rêve le plus cher ! Le debugging en mode veille !"
  },
  {
    id: 14,
    text: "Certains étudiants ont développé une télépathie pour le travail en équipe",
    isTrue: false,
    explanation: "On utilise encore Discord comme tout le monde !"
  },
  {
    id: 15,
    text: "Il faut faire 'sudo rm -rf /' pour nettoyer son dossier personnel",
    isTrue: false,
    explanation: "SURTOUT PAS ! Cette commande nettoie... tout le système !"
  }
];

export default function ESIQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [buttonClicked, setButtonClicked] = useState('');

  // Sound effect functions
  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      if (type === 'correct') {
        // Success sound - happy chord
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        frequencies.forEach((freq, i) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + i * 0.1);

          oscillator.start(audioContext.currentTime + i * 0.1);
          oscillator.stop(audioContext.currentTime + 0.6 + i * 0.1);
        });
      } else if (type === 'incorrect') {
        // Error sound - descending tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else if (type === 'completion') {
        // Completion fanfare
        const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        melody.forEach((freq, i) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'triangle';

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01 + i * 0.2);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3 + i * 0.2);

          oscillator.start(audioContext.currentTime + i * 0.2);
          oscillator.stop(audioContext.currentTime + 0.4 + i * 0.2);
        });
      } else if (type === 'click') {
        // Button click sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    setAnimate(true);
  }, [currentQuestion]);


  const handleAnswer = (answer) => {
    const correct = questions[currentQuestion].isTrue === answer;
    setSelectedAnswer(answer);
    setShowResult(true);
    setButtonClicked(answer ? 'true' : 'false');

    if (correct) {
      setScore(score + 1);
      playSound('correct');
      if (score + 1 === questions.length) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setShowResult(false);
        setSelectedAnswer(null);
        setAnimate(false);
        setButtonClicked('');
      } else {
        playSound('completion');
        setGameFinished(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 4000);
      }
    }, 5000);
  };

  const resetQuiz = () => {
    playSound('click');
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setGameFinished(false);
    setAnimate(false);
    setConfetti(false);
    setButtonClicked('');
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Expert ESI ! Tu connais vraiment la vie étudiante !";
    if (percentage >= 60) return "Pas mal ! Tu commences à cerner l'ESI !";
    if (percentage >= 40) return "Il te reste des choses à découvrir sur l'ESI !";
    return "Nouveau à l'ESI ? Bienvenue dans l'aventure !";
  };

  if (gameFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafdfd] font-sans px-4 relative overflow-hidden">

        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl shadow-xl p-10 transform ">
            <h1 className="text-4xl font-bold mb-6 text-[#05a9a2]">
              Quiz Terminé ! 🎉
            </h1>
            <div className="text-6xl font-bold mb-4 text-[#eea800] transform">
              {score}/{questions.length}
            </div>
            <p className="text-lg mb-8 text-gray-700">{getScoreMessage()}</p>
            <button
              onClick={resetQuiz}
              className="px-8 py-3 rounded-full text-white font-semibold text-lg bg-[#05a9a2] hover:scale-105 active:scale-95 transition-transform hover:shadow-xl"
            >
              Recommencer le Quiz
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes confettiFall {
            to {
              transform: translateY(100vh) rotate(360deg);
            }
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafdfd] font-sans px-4 py-10 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#05a9a2] rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2 text-[#05a9a2] transform hover:scale-105 transition-transform">
            Take It Esi Quiz
          </h1>
          <p className="text-xl mt-3 text-gray-600">
            Vérités et Mensonges sur la vie étudiante à l'ESI
          </p>
          <div className=" mt-3 flex justify-center gap-4">
            <span className="px-5 py-2 rounded-full text-white font-semibold bg-[#eea800] transform hover:scale-105 transition-transform">
              Question {currentQuestion + 1}/{questions.length}
            </span>
            <span className="px-5 py-2 rounded-full text-white font-semibold bg-[#05a9a2] transform hover:scale-105 transition-transform">
              Score: {score}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{
                backgroundColor: "#05a9a2",
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`bg-white rounded-3xl shadow-xl p-8 mb-10 transform transition-all duration-500 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-90"
            } hover:shadow-2xl`}
        >
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 leading-relaxed">
            {questions[currentQuestion].text}
          </h2>

          {!showResult ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => {
                  playSound('click');
                  handleAnswer(true);
                }}
                className="flex-1 max-w-xs px-8 py-4 rounded-2xl text-white font-bold text-xl bg-[#05a9a2] hover:scale-105 active:scale-95 hover:shadow-lg transition-transform relative overflow-hidden group"
              >
                <span className="relative z-10">VÉRITÉ</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  handleAnswer(false);
                }}
                className="flex-1 max-w-xs px-8 py-4 rounded-2xl text-white font-bold text-xl bg-[#c1333f] hover:scale-105 active:scale-95 hover:shadow-lg transition-transform relative overflow-hidden group"
              >
                <span className="relative z-10">MENSONGE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div
                className={`text-4xl mb-2 mt-0 transform transition-transform  animate-bounce scale-100 `}
              >
                {questions[currentQuestion].isTrue === selectedAnswer
                  ? "🎉"
                  : "😅"}
              </div>
              <div
                className={`text-2xl font-bold mb-4 transform transition-all duration-500 ${questions[currentQuestion].isTrue === selectedAnswer
                    ? "text-[#05a9a2] scale-105"
                    : "text-[#c1333f] scale-105"
                  }`}
              >
                {questions[currentQuestion].isTrue === selectedAnswer
                  ? "Correct !"
                  : "Incorrect !"}
              </div>
              <p className="text-lg text-gray-800 font-semibold rounded-3xl p-4 transform hover:scale-105 transition-transform">
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500">
          <p className="text-sm">Créé avec ❤️ pour nos chers étudiants </p>
          <p className="text-xs mt-1">Que la force du savoir soit avec vous !</p>
        </div>
      </div>
    </div>
  );
}