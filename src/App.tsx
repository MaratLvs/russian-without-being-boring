import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import "./App.css";

type AppStep = "welcome" | "intro" | "quiz" | "result";

type StudentProfile = {
  name: string;
  grade: "5" | "6" | "7";
  goal: string;
};

type QuizOption = {
  id: string;
  text: string;
};

type WeakTopic = "НЕ/НИ" | "запятые" | "тся/ться" | "речевые ошибки" | "лексика";

type QuizQuestion = {
  id: number;
  topic: WeakTopic;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  successComment: string;
  errorComment: string;
  explanation: string;
};

type TrainingTask = {
  id: number;
  topic: WeakTopic;
  question: string;
  answer: string;
  explanation: string;
};

type ResultLevel = "base" | "middle" | "strong";

type AnswerRecord = {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  topic: WeakTopic;
};

type WeakTopicContent = {
  topic: WeakTopic;
  title: string;
  explanation: string;
};

type ResultContent = {
  level: ResultLevel;
  title: string;
  diagnosis: string;
  badge: string;
};

const questions: QuizQuestion[] = [
  {
    id: 1,
    topic: "НЕ/НИ",
    question: "Где правильно?",
    options: [
      { id: "q1-a", text: "не смотря на дождь" },
      { id: "q1-b", text: "несмотря на дождь" },
    ],
    correctOptionId: "q1-b",
    successComment: "Отлично, ловушка не сработала.",
    errorComment: "Почти. Тут есть частая ловушка.",
    explanation:
      "Если можно заменить на «вопреки дождю», пишем слитно: «несмотря на дождь».",
  },
  {
    id: 2,
    topic: "запятые",
    question: "Где нужна запятая?",
    options: [
      { id: "q2-a", text: "Когда я пришел домой я сел делать уроки" },
      { id: "q2-b", text: "Когда я пришел домой, я сел делать уроки" },
    ],
    correctOptionId: "q2-b",
    successComment: "Да, запятая на месте.",
    errorComment: "Почти. Запятая здесь действительно легко прячется.",
    explanation:
      "После придаточной части «Когда я пришел домой» нужна запятая перед главной частью.",
  },
  {
    id: 3,
    topic: "тся/ться",
    question: "Где правильно?",
    options: [
      { id: "q3-a", text: "Он учиться в школе" },
      { id: "q3-b", text: "Он учится в школе" },
    ],
    correctOptionId: "q3-b",
    successComment: "Верно. Мягкий знак не пролез.",
    errorComment: "Почти. Это одна из самых частых ошибок.",
    explanation:
      "Задаем вопрос: он что делает? Учится. В вопросе нет мягкого знака, значит и в глаголе его нет.",
  },
  {
    id: 4,
    topic: "речевые ошибки",
    question: "Где нет речевой ошибки?",
    options: [
      { id: "q4-a", text: "более лучше" },
      { id: "q4-b", text: "лучше" },
    ],
    correctOptionId: "q4-b",
    successComment: "Точно. Без лишних слов.",
    errorComment: "Почти. Здесь слово «более» лишнее.",
    explanation:
      "Нельзя смешивать «более» и сравнительную степень. Правильно: «лучше».",
  },
  {
    id: 5,
    topic: "лексика",
    question: "Как правильно сказать?",
    options: [
      { id: "q5-a", text: "ложить книгу" },
      { id: "q5-b", text: "класть книгу" },
    ],
    correctOptionId: "q5-b",
    successComment: "Да, это литературная норма.",
    errorComment: "Почти. В литературной речи лучше использовать «класть».",
    explanation:
      "В литературной речи правильно говорить «класть книгу». Форма «ложить» считается ошибочной.",
  },
];

const weakTopicsContent: WeakTopicContent[] = [
  {
    topic: "НЕ/НИ",
    title: "НЕ/НИ: ловушка на внимательность",
    explanation:
      "Смотри на смысл. Если слово можно заменить близким по смыслу выражением, часто работает слитное написание.",
  },
  {
    topic: "запятые",
    title: "Запятые: не угадывай, а ищи части предложения",
    explanation:
      "Сначала найди грамматические основы. Если одна часть зависит от другой, между ними часто нужна запятая.",
  },
  {
    topic: "тся/ться",
    title: "Тся/ться: проверяй вопросом",
    explanation:
      "Если в вопросе есть мягкий знак — пишем «ться». Если нет — пишем «тся».",
  },
  {
    topic: "речевые ошибки",
    title: "Речевые ошибки: меньше лишних слов",
    explanation:
      "Не усиливай слово дважды. «Более красивее», «самый лучший» и похожие конструкции часто ломают речь.",
  },
  {
    topic: "лексика",
    title: "Лексика: говори точно",
    explanation:
      "Некоторые слова звучат привычно, но в литературной речи считаются ошибкой. Их лучше заменить правильной формой.",
  },
];

const trainingTasks: TrainingTask[] = [
  {
    id: 1,
    topic: "НЕ/НИ",
    question: "Выбери правильный вариант: «___ на усталость, он сделал задание».",
    answer: "Несмотря",
    explanation:
      "Можно заменить на «вопреки усталости», значит пишем слитно: «несмотря».",
  },
  {
    id: 2,
    topic: "запятые",
    question: "Где нужна запятая: «Если будет время я повторю правило»?",
    answer: "Если будет время, я повторю правило.",
    explanation:
      "Придаточная часть стоит перед главной, поэтому после нее нужна запятая.",
  },
  {
    id: 3,
    topic: "тся/ться",
    question: "Выбери вариант: «Мне нужно готови___ к контрольной».",
    answer: "готовиться",
    explanation:
      "Нужно что делать? Готовиться. В вопросе есть мягкий знак, значит он нужен и в слове.",
  },
  {
    id: 4,
    topic: "речевые ошибки",
    question: "Исправь фразу: «Это задание более легче».",
    answer: "Это задание легче.",
    explanation:
      "Сравнительная степень уже есть в слове «легче». Слово «более» лишнее.",
  },
  {
    id: 5,
    topic: "лексика",
    question: "Как сказать правильно: «ложить тетрадь» или «класть тетрадь»?",
    answer: "класть тетрадь",
    explanation:
      "В литературной речи используется вариант «класть».",
  },
];

function getResultContent(correctCount: number): ResultContent {
  if (correctCount <= 1) {
    return {
      level: "base",
      title: "Начинаем с базы",
      diagnosis: "Есть темы, которые можно спокойно разобрать и быстро подтянуть.",
      badge: "Старт прокачки",
    };
  }

  if (correctCount <= 3) {
    return {
      level: "middle",
      title: "База есть",
      diagnosis: "Есть пара тем, которые можно быстро прокачать.",
      badge: "Правило почти поймано",
    };
  }

  return {
    level: "strong",
    title: "Хороший уровень",
    diagnosis: "Осталось убрать точечные ошибки и закрепить результат.",
    badge: "Охотник за ошибками",
  };
}

export default function App() {
  const [appStep, setAppStep] = useState<AppStep>("welcome");
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: "",
    grade: "7",
    goal: "Проверить себя",
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isFeedbackShown, setIsFeedbackShown] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const correctCount = answers.filter((answer) => answer.isCorrect).length;

  const weakTopics = useMemo<WeakTopic[]>(() => {
    const failedTopics = answers
      .filter((answer) => !answer.isCorrect)
      .map((answer) => answer.topic);

    return Array.from(new Set(failedTopics));
  }, [answers]);

  const handleStartIntro = () => {
    setAppStep("intro");
  };

  const handleStartQuiz = () => {
    setAppStep("quiz");
  };

  const handleSelectOption = (optionId: string) => {
    if (isFeedbackShown) return;

    const isCorrect = optionId === currentQuestion.correctOptionId;

    setSelectedOptionId(optionId);
    setIsFeedbackShown(true);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isCorrect,
        topic: currentQuestion.topic,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsFeedbackShown(false);
    } else {
      setAppStep("result");
    }
  };

  const handleRestart = () => {
    setAppStep("welcome");
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsFeedbackShown(false);
    setAnswers([]);
  };

  const showFullNav = appStep === "welcome" || appStep === "intro";

  return (
    <div className="app-shell">
      <header className="site-header" aria-label="Шапка приложения">
        <a className="brand" href="#top" aria-label="На главный экран">
          <span className="brand-icon">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <span>Баттл с Грамотеем</span>
        </a>

        {showFullNav ? (
          <nav className="main-nav">
            <a href="#how">Как работает</a>
            <a href="#topics">Темы</a>
            <a href="#training">Тренировка</a>
          </nav>
        ) : (
          <div className="header-pill">
            <Zap size={16} aria-hidden="true" />
            5 раундов
          </div>
        )}
      </header>

      <main id="top">
        {appStep === "welcome" && (
          <WelcomeSection
            profile={studentProfile}
            onChangeProfile={setStudentProfile}
            onNext={handleStartIntro}
          />
        )}

        {appStep === "intro" && (
          <HeroSection
            profile={studentProfile}
            onStart={handleStartQuiz}
          />
        )}

        {appStep === "quiz" && (
          <QuizSection
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            question={currentQuestion}
            selectedOptionId={selectedOptionId}
            isFeedbackShown={isFeedbackShown}
            onSelectOption={handleSelectOption}
            onNext={handleNextQuestion}
          />
        )}

        {appStep === "result" && (
          <>
            <ResultSection
              profile={studentProfile}
              correctCount={correctCount}
              totalQuestions={questions.length}
              weakTopics={weakTopics}
              onRestart={handleRestart}
            />

            {weakTopics.length > 0 && <TrainingSection weakTopics={weakTopics} />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

type WelcomeSectionProps = {
  profile: StudentProfile;
  onChangeProfile: (profile: StudentProfile) => void;
  onNext: () => void;
};

function WelcomeSection({ profile, onChangeProfile, onNext }: WelcomeSectionProps) {
  return (
    <section className="welcome-section" aria-labelledby="welcome-title">
      <div className="welcome-card">
        <h1 id="welcome-title">Готов к баттлу с Грамотеем?</h1>
        <p>Это не контрольная, а короткая игра по русскому. Грамотей поможет поймать языковые ловушки и покажет, какие темы стоит прокачать.</p>
        
        <div className="mascot-card">
          <div className="mascot-avatar">Г</div>
          <div className="mascot-info">
            <span className="mascot-name">Грамотей</span>
            <span className="mascot-badge">твой помощник</span>
          </div>
          <p>Привет! Я не ставлю оценки. Я помогу найти ловушки в русском и покажу, что прокачать дальше.</p>
        </div>

        <form className="welcome-form" onSubmit={(e) => { e.preventDefault(); if (profile.name.trim()) onNext(); }}>
          <div className="form-group">
            <label htmlFor="student-name">Имя ученика</label>
            <input
              id="student-name"
              type="text"
              placeholder="Например, Маша"
              value={profile.name}
              onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-grade">Класс</label>
            <select
              id="student-grade"
              value={profile.grade}
              onChange={(e) => onChangeProfile({ ...profile, grade: e.target.value as any })}
            >
              <option value="5">5 класс</option>
              <option value="6">6 класс</option>
              <option value="7">7 класс</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="student-goal">Цель</label>
            <select
              id="student-goal"
              value={profile.goal}
              onChange={(e) => onChangeProfile({ ...profile, goal: e.target.value })}
            >
              <option value="Проверить себя">Проверить себя</option>
              <option value="Меньше ошибок в диктантах">Меньше ошибок в диктантах</option>
              <option value="Подготовиться к контрольной">Подготовиться к контрольной</option>
              <option value="Прокачать русский без скуки">Прокачать русский без скуки</option>
            </select>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={!profile.name.trim()}
          >
            Войти в баттл
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}

type HeroSectionProps = {
  profile: StudentProfile;
  onStart: () => void;
};

function HeroSection({ profile, onStart }: HeroSectionProps) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">{profile.name}, начинаем баттл?</h1>
          <p>
            Будет 5 коротких раундов. После каждого ответа Грамотей сразу объяснит, почему так правильно. В конце ты увидишь сильные темы и получишь тренировку по ошибкам.
          </p>

          <button className="primary-button" type="button" onClick={onStart}>
            Начать баттл
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="hero-card" aria-label="Что будет внутри теста">
          <h2>Грамотей на связи</h2>
          <p>
            Твоя миссия — пройти 5 языковых ловушек, не попасться на ошибки и понять, какие правила стоит повторить.
          </p>

          <div className="mini-stats">
            <span>5 раундов</span>
            <span>сразу объясняю</span>
            <span>без оценок</span>
          </div>
        </div>
      </div>
    </section>
  );
}

type QuizSectionProps = {
  currentIndex: number;
  totalQuestions: number;
  question: QuizQuestion;
  selectedOptionId: string | null;
  isFeedbackShown: boolean;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
};

function QuizSection({
  currentIndex,
  totalQuestions,
  question,
  selectedOptionId,
  isFeedbackShown,
  onSelectOption,
  onNext,
}: QuizSectionProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <section className="quiz-section" aria-labelledby="quiz-title">
      <div className="section-heading">
        <div className="badge">
          <BookOpen size={16} aria-hidden="true" />
          Раунд {currentIndex + 1} из {totalQuestions}
        </div>
      </div>

      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Прогресс теста"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <QuestionCard
        question={question}
        selectedOptionId={selectedOptionId}
        isFeedbackShown={isFeedbackShown}
        isLastQuestion={currentIndex === totalQuestions - 1}
        onSelectOption={onSelectOption}
        onNextQuestion={onNext}
      />
    </section>
  );
}

type QuestionCardProps = {
  question: QuizQuestion;
  selectedOptionId: string | null;
  isFeedbackShown: boolean;
  isLastQuestion: boolean;
  onSelectOption: (optionId: string) => void;
  onNextQuestion: () => void;
};

function QuestionCard({
  question,
  selectedOptionId,
  isFeedbackShown,
  isLastQuestion,
  onSelectOption,
  onNextQuestion,
}: QuestionCardProps) {
  const selectedIsCorrect = selectedOptionId === question.correctOptionId;

  return (
    <article className="question-card">
      <div className="topic-chip">{question.topic}</div>

      <h2>{question.question}</h2>

      <div className="options-grid" aria-label="Варианты ответа">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;

          const optionClassName = [
            "option-button",
            isSelected ? "is-selected" : "",
            isFeedbackShown && isCorrectOption ? "is-correct" : "",
            isFeedbackShown && isSelected && !isCorrectOption ? "is-wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={option.id}
              className={optionClassName}
              type="button"
              onClick={() => onSelectOption(option.id)}
              disabled={isFeedbackShown}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {isFeedbackShown && selectedOptionId && (
        <div className={selectedIsCorrect ? "feedback correct" : "feedback wrong"}>
          <div className="feedback-title">
            {selectedIsCorrect ? (
              <CheckCircle2 size={20} aria-hidden="true" />
            ) : (
              <XCircle size={20} aria-hidden="true" />
            )}
            <strong>{selectedIsCorrect ? "Правильно" : "Ошибка"}</strong>
          </div>

          <p>{selectedIsCorrect ? question.successComment : question.errorComment}</p>
          <p className="feedback-explanation">{question.explanation}</p>

          <button className="secondary-button" type="button" onClick={onNextQuestion}>
            {isLastQuestion ? "Показать результат" : "Следующий раунд"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </article>
  );
}

type ResultSectionProps = {
  profile: StudentProfile;
  correctCount: number;
  totalQuestions: number;
  weakTopics: WeakTopic[];
  onRestart: () => void;
};

function ResultSection({
  profile,
  correctCount,
  totalQuestions,
  weakTopics,
  onRestart,
}: ResultSectionProps) {
  const result = getResultContent(correctCount);

  return (
    <section className="result-section" aria-labelledby="result-title">
      <div className={`result-card result-${result.level}`}>
        <div className="badge">
          <Target size={16} aria-hidden="true" />
          Результат
        </div>

        <h1 id="result-title">
          {profile.name}, твой результат: {correctCount} из {totalQuestions}
        </h1>

        <div className="result-badge">
          Твой бейдж: <strong>{result.badge}</strong>
        </div>

        <h2>{result.title}</h2>
        <p>{result.diagnosis}</p>

        <div className="weak-topics">
          <h3>Темы для прокачки</h3>

          {weakTopics.length > 0 ? (
            <ul>
              {weakTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="no-errors">Сегодня русский явно на твоей стороне.</p>
          )}
        </div>

        <button className="secondary-button" type="button" onClick={onRestart}>
          Пройти баттл заново
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

type TrainingSectionProps = {
  weakTopics: WeakTopic[];
};

function TrainingSection({ weakTopics }: TrainingSectionProps) {
  const weakContent = weakTopicsContent.filter((content) =>
    weakTopics.includes(content.topic)
  );

  const tasks = trainingTasks.filter((task) => weakTopics.includes(task.topic));

  return (
    <section id="training" className="training-section" aria-labelledby="training-title">
      <div className="section-heading">
        <div className="badge">
          <Zap size={16} aria-hidden="true" />
          Тренировка
        </div>

        <h2 id="training-title">Тренировка от Грамотея</h2>
        <p>Только то, где были ошибки. Коротко, понятно и без скучных таблиц.</p>
      </div>

      <div className="training-grid">
        {weakContent.map((content) => {
          const task = tasks.find((item) => item.topic === content.topic);

          return (
            <article className="training-card" key={content.topic}>
              <div className="topic-chip">{content.topic}</div>
              <h3>{content.title}</h3>
              <p>{content.explanation}</p>

              {task && (
                <div className="task-box">
                  <h4>Мини-задание</h4>
                  <p>{task.question}</p>

                  <details>
                    <summary>Показать ответ</summary>
                    <div className="answer-box">
                      <strong>{task.answer}</strong>
                      <span>{task.explanation}</span>
                    </div>
                  </details>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>Мини-баттл по русскому для 5–7 классов</p>
      <p>Без оценок, скучных лекций и паники</p>
      <p>© 2026 Баттл с Грамотеем</p>
    </footer>
  );
}
