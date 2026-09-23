import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ["en","es","fr","de","hi","zh","ja","pt","ru","ar","it","ko","nl","tr","pl","sv","da","fi","no","el","cs","hu","ro","th","vi","id","ms","bn","ta","te","ur"];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
