// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require("ask-sdk-core");
const i18n = require("i18next");
const sprintf = require("i18next-sprintf-postprocessor");

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t("LAUNCH_MESSAGE");
    handlerInput.attributesManager.setSessionAttributes({});
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};
// core functionality for fact skill
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetNewFactIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const randomFact = requestAttributes.t("FACTS");
    const speakOutput = requestAttributes.t("GET_FACT_MESSAGE") + randomFact;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t("SKILL_NAME"), randomFact)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("HELP_MESSAGE"))
      .reprompt(requestAttributes.t("HELP_REPROMPT"))
      .getResponse();
  }
};

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("FALLBACK_MESSAGE"))
      .reprompt(requestAttributes.t("FALLBACK_REPROMPT"))
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("STOP_MESSAGE"))
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("ERROR_MESSAGE"))
      .reprompt(requestAttributes.t("ERROR_MESSAGE"))
      .getResponse();
  }
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

const jpData = {
  translation: {
    SKILL_NAME: "日本語版豆知識",
    LAUNCH_MESSAGE: "今おひまですか？",
    HELP_MESSAGE:
      "豆知識を聞きたい時は「豆知識」と、終わりたい時は「おしまい」と言ってください。どうしますか？",
    HELP_REPROMPT: "どうしますか？",
    ERROR_MESSAGE: "申し訳ありませんが、エラーが発生しました",
    STOP_MESSAGE: "さようなら",
    FACTS: [
      "水星の一年はたった88日です。",
      "金星は水星と比べて太陽より遠くにありますが、気温は水星よりも高いです。",
      "金星は反時計回りに自転しています。過去に起こった隕石の衝突が原因と言われています。",
      "火星上から見ると、太陽の大きさは地球から見た場合の約半分に見えます。",
      '木星の<sub alias="いちにち">1日</sub>は全惑星の中で一番短いです。',
      "天の川銀河は約50億年後にアンドロメダ星雲と衝突します。"
    ]
  }
};

const jpjpData = {
  translation: {
    SKILL_NAME: "いつかやろう"
  }
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  ja: jpData,
  "ja-JP": jpjpData
};

const sampleData = {
  tasks: [
    {
      title: "技術書DDDを一章読む",
      min: 30
    },
    {
      title: "自作ライブラリの機能を一つつくる",
      min: 45
    },
    {
      title: "書きたいシナリオのプロットを書く",
      min: 60
    },
    {
      title: "旅行の計画をたてる",
      min: 90
    },
    {
      title: "部屋に掃除機をかける",
      min: 30
    }
  ]
};
