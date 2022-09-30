import React from "react";
import { gameState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";

type Props = {
  translateKey: string;
};

const LanguageTranslate = ({ translateKey }: Props) => {
  const { language, allLanguageTexts } = AppSelector(gameState);
  const text = allLanguageTexts.find((item: any) => item.key === translateKey);
  const translation = text ? (text[language] ? text[language] : "") : "";
  return translation;
};

export default LanguageTranslate;
