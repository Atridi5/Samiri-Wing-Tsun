import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

type Locale = "sq" | "en" | "de";

async function upsertSiteText(
  section: string,
  values: Record<Locale, { title?: string; subtitle?: string; body?: string }>
) {
  for (const locale of Object.keys(values) as Locale[]) {
    const v = values[locale];
    await prisma.siteText.upsert({
      where: { section_locale: { section, locale } },
      update: { title: v.title, subtitle: v.subtitle, body: v.body },
      create: { section, locale, title: v.title, subtitle: v.subtitle, body: v.body },
    });
  }
}

async function main() {
  // ---------- Admin user ----------
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "WingTsun2026!";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: { username, passwordHash },
  });

  // ---------- Site texts ----------
  await upsertSiteText("hero", {
    sq: {
      title: "SAMIR WING TSUN SYSTEM",
      subtitle: "Trajno trupin. Forco mendjen. Jeto pa limit.",
      body: "Më shumë se një sport — një rrugë për jetën. Mëso artin e vetëmbrojtjes Wing Tsun në Ferizaj, nën udhëheqjen e Sifu Samir Ibishi.",
    },
    en: {
      title: "SAMIR WING TSUN SYSTEM",
      subtitle: "Train the body. Strengthen the mind. Live without limits.",
      body: "More than a sport — a way of life. Learn the art of Wing Tsun self-defense in Ferizaj, led by Sifu Samir Ibishi.",
    },
    de: {
      title: "SAMIR WING TSUN SYSTEM",
      subtitle: "Trainiere den Körper. Stärke den Geist. Lebe ohne Limit.",
      body: "Mehr als ein Sport — ein Weg fürs Leben. Erlerne die Kunst der Wing-Tsun-Selbstverteidigung in Ferizaj unter der Leitung von Sifu Samir Ibishi.",
    },
  });

  await upsertSiteText("intro", {
    sq: {
      title: "Arti i thjeshtë. Efektiv. Për jetë.",
      body: "Dëshiron të mbrosh veten dhe të tjerët në situata të ndryshme? Wing Tsun System ofron mbrojtje efektive, reflekse të shpejta, trup të fortë e mendje të qetë — për çdo moshë. Trajnim i vërtetë, rezultate të vërteta.",
    },
    en: {
      title: "The simple art. Effective. For life.",
      body: "Do you want to protect yourself and others in different situations? Wing Tsun System offers effective defense, fast reflexes, a strong body and a calm mind — for every age. Real training, real results.",
    },
    de: {
      title: "Die einfache Kunst. Effektiv. Fürs Leben.",
      body: "Möchtest du dich und andere in verschiedenen Situationen schützen? Wing Tsun System bietet effektiven Schutz, schnelle Reflexe, einen starken Körper und einen ruhigen Geist — für jedes Alter. Echtes Training, echte Ergebnisse.",
    },
  });

  await upsertSiteText("why", {
    sq: {
      title: "Wing Tsun nuk është vetëm sport, është një jetë më e mirë!",
      body: "Në Ferizaj, ne ndërtojmë një brez të ri — të fortë në trup, të qetë në mendje dhe të drejtë në karakter.",
    },
    en: {
      title: "Wing Tsun is not just a sport, it's a better life!",
      body: "In Ferizaj, we are building a new generation — strong in body, calm in mind and upright in character.",
    },
    de: {
      title: "Wing Tsun ist nicht nur ein Sport, es ist ein besseres Leben!",
      body: "In Ferizaj bauen wir eine neue Generation auf — stark im Körper, ruhig im Geist und aufrichtig im Charakter.",
    },
  });

  await upsertSiteText("comparison", {
    sq: { title: "Njerëzit Pasiv", subtitle: "Njerëzit Aktiv" },
    en: { title: "Passive People", subtitle: "Active People" },
    de: { title: "Passive Menschen", subtitle: "Aktive Menschen" },
  });

  await upsertSiteText("programs", {
    sq: { title: "Programet Tona", body: "Trajnime të përshtatura për çdo grupmoshë — nga fëmijët deri te të rriturit." },
    en: { title: "Our Programs", body: "Training tailored for every age group — from kids to adults." },
    de: { title: "Unsere Programme", body: "Training für jede Altersgruppe — von Kindern bis Erwachsenen." },
  });

  await upsertSiteText("kids_section", {
    sq: {
      title: "Largohen nga telefoni dhe rrjetet sociale!",
      body: "Sporti i largon fëmijët nga ekrani dhe i motivon të jetojnë aktiv, të socializohen dhe të krijojnë miqësi të vërteta. Rrit energjinë dhe fokusimin!",
    },
    en: {
      title: "Away from phones and social media!",
      body: "Sport pulls kids away from screens and motivates them to live actively, socialize and build real friendships. It boosts energy and focus!",
    },
    de: {
      title: "Weg von Handy und sozialen Medien!",
      body: "Sport bringt Kinder weg vom Bildschirm und motiviert sie, aktiv zu leben, sich zu sozialisieren und echte Freundschaften zu schließen. Er steigert Energie und Fokus!",
    },
  });

  await upsertSiteText("gallery", {
    sq: { title: "Galeria", body: "Momente nga trajnimet tona." },
    en: { title: "Gallery", body: "Moments from our training sessions." },
    de: { title: "Galerie", body: "Momente aus unserem Training." },
  });

  await upsertSiteText("location", {
    sq: { title: "Na Gjeni", body: "Ejani të na vizitoni në qendrën tonë të stërvitjes në Ferizaj." },
    en: { title: "Find Us", body: "Come visit us at our training center in Ferizaj." },
    de: { title: "Finden Sie Uns", body: "Besuchen Sie uns in unserem Trainingszentrum in Ferizaj." },
  });

  await upsertSiteText("cta", {
    sq: { title: "Disiplinë sot, sukses nesër!", subtitle: "Bëhu versioni më i mirë i vetes.", body: "Regjistrohu sot dhe fillo udhëtimin tënd në Wing Tsun." },
    en: { title: "Discipline today, success tomorrow!", subtitle: "Become the best version of yourself.", body: "Sign up today and start your Wing Tsun journey." },
    de: { title: "Disziplin heute, Erfolg morgen!", subtitle: "Werde die beste Version von dir selbst.", body: "Melde dich noch heute an und beginne deine Wing-Tsun-Reise." },
  });

  await upsertSiteText("footer", {
    sq: { body: "Të gjitha të drejtat e rezervuara." },
    en: { body: "All rights reserved." },
    de: { body: "Alle Rechte vorbehalten." },
  });

  await upsertSiteText("rules", {
    sq: {
      title: "Rregullat",
      body: [
        "Të gjithë pjesëmarrësit duhet të respektojnë instruktorin, bashkëtrajnuesit dhe rregullat e sallës.",
        "Të respektohet rregulla e uniformës (maica e Samir Wing Tsun System, trenerka të gjatë të zeza), si dhe përdorimi i pajisjeve mbrojtëse kur kërkohet nga instruktori.",
        "Ndalohet nënçmimi, nënvlerësimi ose talljja me pjesëmarrës të stileve apo arteve të tjera marciale.",
        "Sjellje agresive apo provokuese janë të ndaluara gjatë stërvitjeve. Në rast shkeljeje, pjesëmarrësi paralajmërohet, ndërsa pas tri paralajmërimeve përjashtohet nga trajnimi.",
        "Trajneri ka të drejtë të përjashtojë menjëherë nga trajnimi çdo pjesëmarrës që është nën ndikimin e alkoolit ose drogave.",
        "Nëse një pjesëmarrës nuk mund të vijë në trajnim, duhet ta njoftojë instruktorin me kohë.",
        "Gjatë trajnimit nuk lejohet përdorimi i telefonit celular. Në rast telefonatash urgjente, përgjigjuni jashtë sallës së stërvitjes.",
        "Teknikat dhe mësimet e Samir Wing Tsun System përdoren vetëm për vetëmbrojtje, në përputhje me ligjin.",
        "Teknikat dhe mësimet nuk lejohen t'u mësohen personave të tjerë jashtë shkollës pa lejen e instruktorit.",
        "Lëndimet e vogla që mund të ndodhin gjatë stërvitjeve, si pjesë e aktiviteteve sportive, duhet të pranohen; instruktori kujdeset që rreziku të minimizohet sa më shumë.",
        "Në raste të veçanta të shkeljes së rregullave, instruktori ka të drejtë t'ia ndalojë pjesëmarrjen dhe/ose ta shpallë të pavlefshme diplomën apo gradën e personit.",
        "Trajnimet zhvillohen 3 herë në javë, ndërsa pagesa bëhet në fillim të çdo muaji.",
      ].join("\n"),
    },
    en: {
      title: "Rules",
      body: [
        "All participants must respect the instructor, fellow trainees and the hall's rules.",
        "The uniform rule must be respected (Samir Wing Tsun System t-shirt, long black training pants), as well as wearing protective gear when required by the instructor.",
        "Belittling, underestimating or mocking practitioners of other styles or martial arts is prohibited.",
        "Aggressive or provocative behavior is not allowed during training. In case of violation, the participant is warned; after three warnings, they are excluded from training.",
        "The instructor has the right to immediately exclude from training any participant under the influence of alcohol or drugs.",
        "If a participant cannot attend training, they must notify the instructor in advance.",
        "Mobile phone use is not allowed during training. For urgent calls, please step outside the training hall.",
        "Samir Wing Tsun System techniques and teachings are to be used only for self-defense, in accordance with the law.",
        "Techniques and teachings may not be taught to others outside the school without the instructor's permission.",
        "Minor injuries that may occur during training, as part of sports activities, must be accepted; the instructor works to minimize risk as much as possible.",
        "In special cases of rule violations, the instructor has the right to deny participation and/or invalidate the person's diploma or rank.",
        "Training sessions are held 3 times a week, with payment due at the start of each month.",
      ].join("\n"),
    },
    de: {
      title: "Regeln",
      body: [
        "Alle Teilnehmer müssen den Instruktor, die Mittrainierenden und die Regeln der Halle respektieren.",
        "Die Uniformregel ist einzuhalten (Samir Wing Tsun System T-Shirt, lange schwarze Trainingshose), ebenso das Tragen von Schutzausrüstung, wenn vom Instruktor verlangt.",
        "Herabwürdigung, Unterschätzung oder Verspottung von Praktizierenden anderer Stile oder Kampfkünste ist untersagt.",
        "Aggressives oder provokantes Verhalten ist während des Trainings nicht erlaubt. Bei Verstoß wird der Teilnehmer verwarnt; nach drei Verwarnungen erfolgt der Ausschluss vom Training.",
        "Der Instruktor hat das Recht, jeden Teilnehmer, der unter Alkohol- oder Drogeneinfluss steht, sofort vom Training auszuschließen.",
        "Kann ein Teilnehmer nicht am Training teilnehmen, muss er den Instruktor rechtzeitig informieren.",
        "Die Nutzung von Mobiltelefonen ist während des Trainings nicht erlaubt. Bei dringenden Anrufen bitte die Trainingshalle verlassen.",
        "Die Techniken und Lehren von Samir Wing Tsun System dürfen nur zur Selbstverteidigung, im Einklang mit dem Gesetz, genutzt werden.",
        "Techniken und Lehren dürfen ohne Erlaubnis des Instruktors nicht an Dritte außerhalb der Schule weitergegeben werden.",
        "Kleinere Verletzungen, die während des Trainings als Teil sportlicher Aktivitäten auftreten können, sind zu akzeptieren; der Instruktor bemüht sich, das Risiko so weit wie möglich zu minimieren.",
        "In besonderen Fällen von Regelverstößen hat der Instruktor das Recht, die Teilnahme zu verweigern und/oder das Diplom bzw. den Rang der Person für ungültig zu erklären.",
        "Die Trainingseinheiten finden 3-mal pro Woche statt, die Zahlung erfolgt zu Beginn jedes Monats.",
      ].join("\n"),
    },
  });

  // ---------- Programs ----------
  const programsData: {
    slug: string;
    icon: string;
    order: number;
    t: Record<Locale, { title: string; description: string }>;
  }[] = [
    {
      slug: "kids",
      icon: "sparkles",
      order: 1,
      t: {
        sq: { title: "Kids (5-9 vjeç)", description: "Disiplinë, respekt dhe vetëbesim që nga mosha e hershme, në një mjedis argëtues e të sigurt. E Martë, E Enjte, E Shtunë — 19:00-20:00." },
        en: { title: "Kids (5-9 years)", description: "Discipline, respect and self-confidence from an early age, in a fun and safe environment. Tue, Thu, Sat — 19:00-20:00." },
        de: { title: "Kids (5-9 Jahre)", description: "Disziplin, Respekt und Selbstvertrauen von klein auf, in einer sicheren und spaßigen Umgebung. Di, Do, Sa — 19:00-20:00." },
      },
    },
    {
      slug: "teens",
      icon: "target",
      order: 2,
      t: {
        sq: { title: "Të Rinj (10-17 vjeç)", description: "Zhvillim fizik e mendor, fokus dhe mbrojtje efektive për adoleshentët. E Martë, E Enjte, E Shtunë — 20:00-21:00." },
        en: { title: "Teens (10-17 years)", description: "Physical and mental development, focus and effective self-defense for teenagers. Tue, Thu, Sat — 20:00-21:00." },
        de: { title: "Jugendliche (10-17 Jahre)", description: "Körperliche und geistige Entwicklung, Fokus und effektive Selbstverteidigung für Jugendliche. Di, Do, Sa — 20:00-21:00." },
      },
    },
    {
      slug: "adults",
      icon: "shield",
      order: 3,
      t: {
        sq: { title: "Të Rritur (18+ vjeç)", description: "Kondicion fizik, çlirim nga stresi dhe teknika reale vetëmbrojtjeje për jetën e përditshme. E Martë, E Enjte, E Shtunë — 21:00-22:00." },
        en: { title: "Adults (18+ years)", description: "Physical conditioning, stress relief and real self-defense techniques for everyday life. Tue, Thu, Sat — 21:00-22:00." },
        de: { title: "Erwachsene (18+ Jahre)", description: "Fitness, Stressabbau und reale Selbstverteidigungstechniken für den Alltag. Di, Do, Sa — 21:00-22:00." },
      },
    },
  ];

  for (const p of programsData) {
    const program = await prisma.program.upsert({
      where: { slug: p.slug },
      update: { icon: p.icon, order: p.order },
      create: { slug: p.slug, icon: p.icon, order: p.order },
    });
    for (const locale of Object.keys(p.t) as Locale[]) {
      await prisma.programTranslation.upsert({
        where: { programId_locale: { programId: program.id, locale } },
        update: p.t[locale],
        create: { programId: program.id, locale, ...p.t[locale] },
      });
    }
  }

  // ---------- Benefits: active vs passive comparison ----------
  const passive: Record<Locale, string[]> = {
    sq: [
      "Lodhje dhe energji e ulët",
      "Stres dhe ankth i shtuar",
      "Rrezik i sëmundjeve të zemrës",
      "Mbipeshë dhe diabet",
      "Imunitet i dobët",
      "Vetëbesim i ulët",
      "Jetë më e shkurtër",
      "Asnjë kontroll mbi veten",
    ],
    en: [
      "Fatigue and low energy",
      "Increased stress and anxiety",
      "Risk of heart disease",
      "Overweight and diabetes",
      "Weak immunity",
      "Low self-confidence",
      "Shorter life",
      "No control over yourself",
    ],
    de: [
      "Müdigkeit und wenig Energie",
      "Erhöhter Stress und Angst",
      "Risiko für Herzkrankheiten",
      "Übergewicht und Diabetes",
      "Schwaches Immunsystem",
      "Geringes Selbstvertrauen",
      "Kürzeres Leben",
      "Keine Kontrolle über sich selbst",
    ],
  };
  const active: Record<Locale, string[]> = {
    sq: [
      "Energji e lartë dhe vitalitet",
      "Mendje e qetë dhe e fokusuar",
      "Zemër e shëndetshme",
      "Peshë e kontrolluar",
      "Imunitet i fortë",
      "Vetëbesim dhe disiplinë",
      "Jetë më e gjatë dhe cilësore",
      "Arrij qëllimet e tua",
      "Vetëmbrojtje në çdo hap",
    ],
    en: [
      "High energy and vitality",
      "Calm and focused mind",
      "Healthy heart",
      "Controlled weight",
      "Strong immunity",
      "Self-confidence and discipline",
      "Longer, quality life",
      "Achieve your goals",
      "Self-defense at every step",
    ],
    de: [
      "Hohe Energie und Vitalität",
      "Ruhiger, fokussierter Geist",
      "Gesundes Herz",
      "Kontrolliertes Gewicht",
      "Starkes Immunsystem",
      "Selbstvertrauen und Disziplin",
      "Längeres, hochwertiges Leben",
      "Erreiche deine Ziele",
      "Selbstverteidigung bei jedem Schritt",
    ],
  };
  const whyTrain: Record<Locale, string[]> = {
    sq: ["Mbrojtje Efektive", "Reflekse të Shpejta", "Trup i Fortë, Mendje e Qetë", "Për Çdo Moshë"],
    en: ["Effective Protection", "Fast Reflexes", "Strong Body, Calm Mind", "For Every Age"],
    de: ["Effektiver Schutz", "Schnelle Reflexe", "Starker Körper, Ruhiger Geist", "Für Jedes Alter"],
  };

  async function seedBenefitGroup(category: string, icons: string[], data: Record<Locale, string[]>) {
    const count = data.sq.length;
    for (let i = 0; i < count; i++) {
      const benefit = await prisma.benefit.create({
        data: { category, icon: icons[i % icons.length], order: i },
      });
      for (const locale of Object.keys(data) as Locale[]) {
        await prisma.benefitTranslation.create({
          data: { benefitId: benefit.id, locale, text: data[locale][i] },
        });
      }
    }
  }

  const existingBenefits = await prisma.benefit.count();
  if (existingBenefits === 0) {
    await seedBenefitGroup("passive", ["frown", "brain", "heart", "scale", "shield-off", "trending-down", "clock", "x-circle"], passive);
    await seedBenefitGroup("active", ["zap", "brain", "heart", "scale", "shield-check", "trending-up", "clock", "target", "users"], active);
    await seedBenefitGroup("why", ["shield-check", "wind", "brain-circuit", "users"], whyTrain);
  }

  // ---------- FAQ (chatbot) ----------
  const faqData: { t: Record<Locale, { question: string; answer: string }> }[] = [
    {
      t: {
        sq: {
          question: "Sa kushton abonimi mujor?",
          answer: "Abonimi mujor kushton 30€, i njëjtë për Kids, Të Rinj dhe Të Rritur. Uniforma është obligative dhe kushton 15€ (paguhet vetëm një herë). Dita e parë e stërvitjes është plotësisht falas!",
        },
        en: {
          question: "How much does the monthly membership cost?",
          answer: "The monthly membership is €30, the same price for Kids, Teens and Adults. A uniform is mandatory and costs €15 (one-time payment). Your first training day is completely free!",
        },
        de: {
          question: "Was kostet die monatliche Mitgliedschaft?",
          answer: "Die monatliche Mitgliedschaft kostet 30€, derselbe Preis für Kids, Jugendliche und Erwachsene. Eine Uniform ist obligatorisch und kostet 15€ (einmalig). Dein erster Trainingstag ist komplett kostenlos!",
        },
      },
    },
    {
      t: {
        sq: {
          question: "A ka orë provë falas?",
          answer: "Po! Dita e parë e stërvitjes është plotësisht falas, për të gjitha moshat. Regjistrohu përmes butonit 'Regjistrohu' dhe stafi ynë do të të kontaktojë për ta caktuar.",
        },
        en: {
          question: "Is there a free trial class?",
          answer: "Yes! Your first training day is completely free, for all ages. Sign up using the 'Join Now' button and our team will contact you to schedule it.",
        },
        de: {
          question: "Gibt es eine kostenlose Probestunde?",
          answer: "Ja! Dein erster Trainingstag ist für alle Altersgruppen komplett kostenlos. Melde dich über den Button 'Jetzt Anmelden' an, und unser Team meldet sich, um sie zu vereinbaren.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Nga cila moshë mund të fillojnë fëmijët?",
          answer: "Kemi tri grupmosha: Fëmijë 5-9 vjeç, Të Rinj 10-17 vjeç, dhe Të Rritur 18 vjeç e lart. Çdo grup ka orarin e vet të stërvitjes.",
        },
        en: {
          question: "From what age can kids start?",
          answer: "We have three age groups: Kids 5-9 years, Teens 10-17 years, and Adults 18 and up. Each group has its own training schedule.",
        },
        de: {
          question: "Ab welchem Alter können Kinder beginnen?",
          answer: "Wir haben drei Altersgruppen: Kids 5-9 Jahre, Jugendliche 10-17 Jahre und Erwachsene ab 18 Jahren. Jede Gruppe hat ihren eigenen Trainingsplan.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Ku ndodheni?",
          answer: "Ndodhemi në Rr. Sinan Sahiti 79, Ferizaj. Shiko seksionin 'Lokacioni' në faqe për hartën dhe udhëzimet.",
        },
        en: {
          question: "Where are you located?",
          answer: "We're located at Rr. Sinan Sahiti 79, Ferizaj. Check the 'Location' section on the page for the map and directions.",
        },
        de: {
          question: "Wo befindet ihr euch?",
          answer: "Wir befinden uns in der Rr. Sinan Sahiti 79, Ferizaj. Siehe den Abschnitt 'Standort' auf der Seite für Karte und Wegbeschreibung.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "A duhet përvojë paraprake për t'u regjistruar?",
          answer: "Jo, Wing Tsun System pranon çdo nivel — nga fillestarët deri te praktikuesit me përvojë. Programi përshtatet për ty.",
        },
        en: {
          question: "Do I need prior experience to join?",
          answer: "No, Wing Tsun System welcomes every level — from complete beginners to experienced practitioners. The program adapts to you.",
        },
        de: {
          question: "Brauche ich Vorerfahrung, um mitzumachen?",
          answer: "Nein, Wing Tsun System heißt jedes Niveau willkommen — von absoluten Anfängern bis zu erfahrenen Praktizierenden. Das Programm passt sich dir an.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Sa herë në javë zhvillohen stërvitjet?",
          answer: "Stërvitjet zhvillohen 3 herë në javë — të martën, të enjten dhe të shtunën. Fëmijët (5-9 vjeç) stërviten 19:00-20:00, Të Rinjtë (10-17 vjeç) 20:00-21:00, dhe Të Rriturit (18+) 21:00-22:00.",
        },
        en: {
          question: "How many times a week are the training sessions?",
          answer: "Training sessions run 3 times a week — Tuesday, Thursday and Saturday. Kids (5-9) train 19:00-20:00, Teens (10-17) train 20:00-21:00, and Adults (18+) train 21:00-22:00.",
        },
        de: {
          question: "Wie oft pro Woche finden die Trainings statt?",
          answer: "Die Trainings finden 3-mal pro Woche statt — Dienstag, Donnerstag und Samstag. Kids (5-9) trainieren 19:00-20:00, Jugendliche (10-17) 20:00-21:00, und Erwachsene (18+) 21:00-22:00.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Çfarë duhet të sjell në stërvitjen e parë?",
          answer: "Për ditën e parë (falas) mjafton veshje sportive e rehatshme dhe një shishe ujë. Uniforma (15€, obligative pas fillimit) sigurohet nga shkolla jonë.",
        },
        en: {
          question: "What should I bring to my first training session?",
          answer: "For your free first day, just comfortable sportswear and a water bottle. The uniform (€15, mandatory once you join) is provided by our school.",
        },
        de: {
          question: "Was soll ich zum ersten Training mitbringen?",
          answer: "Für deinen kostenlosen ersten Tag genügen bequeme Sportkleidung und eine Wasserflasche. Die Uniform (15€, obligatorisch nach dem Beitritt) wird von unserer Schule bereitgestellt.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "A ofroni stërvitje private (1-me-1)?",
          answer: "Po, ofrojmë edhe orë private për ata që duan vëmendje më të fokusuar. Na kontakto në telefon ose WhatsApp për detaje dhe çmim.",
        },
        en: {
          question: "Do you offer private (1-on-1) training?",
          answer: "Yes, we also offer private sessions for those who want more focused attention. Contact us by phone or WhatsApp for details and pricing.",
        },
        de: {
          question: "Bietet ihr Privattraining (1-zu-1) an?",
          answer: "Ja, wir bieten auch Privatstunden für alle, die mehr individuelle Betreuung möchten. Kontaktiere uns per Telefon oder WhatsApp für Details und Preise.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "A merren certifikata apo gradë (Sash/Level)?",
          answer: "Po, studentët përparojnë nëpër nivele/grada zyrtare të Wing Tsun System, bazuar në njohuri, kohë stërvitjeje dhe vlerësim nga Sifu Samir Ibishi.",
        },
        en: {
          question: "Do students receive certificates or belt/level ranks?",
          answer: "Yes, students progress through official Wing Tsun System levels/ranks, based on knowledge, training time and evaluation by Sifu Samir Ibishi.",
        },
        de: {
          question: "Erhalten Schüler Zertifikate oder Gürtel/Levels?",
          answer: "Ja, Schüler durchlaufen offizielle Wing Tsun System Levels/Grade, basierend auf Wissen, Trainingszeit und Bewertung durch Sifu Samir Ibishi.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Si mund të anuloj ose pauzoj abonimin?",
          answer: "Na kontakto direkt në telefon ose WhatsApp dhe stafi ynë do të të ndihmojë të pauzosh ose anulosh abonimin sipas politikave tona.",
        },
        en: {
          question: "How can I cancel or pause my membership?",
          answer: "Contact us directly by phone or WhatsApp and our staff will help you pause or cancel your membership according to our policies.",
        },
        de: {
          question: "Wie kann ich meine Mitgliedschaft kündigen oder pausieren?",
          answer: "Kontaktiere uns direkt per Telefon oder WhatsApp, und unser Team hilft dir, deine Mitgliedschaft gemäß unseren Richtlinien zu pausieren oder zu kündigen.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Kush është trajneri/instruktori?",
          answer: "Sifu Samir Ibishi është themeluesi dhe instruktori kryesor i Samir Wing Tsun System në Ferizaj, me përvojë e certifikime në artin e Wing Tsun.",
        },
        en: {
          question: "Who is the trainer/instructor?",
          answer: "Sifu Samir Ibishi is the founder and head instructor of Samir Wing Tsun System in Ferizaj, with years of experience and certification in the art of Wing Tsun.",
        },
        de: {
          question: "Wer ist der Trainer/Ausbilder?",
          answer: "Sifu Samir Ibishi ist der Gründer und Chefausbilder von Samir Wing Tsun System in Ferizaj, mit langjähriger Erfahrung und Zertifizierung in der Kunst des Wing Tsun.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Sa kushton uniforma dhe a është obligative?",
          answer: "Uniforma është obligative dhe kushton 15€, paguhet vetëm një herë (jo mujore). Nuk nevojitet për ditën e parë të stërvitjes, e cila është falas.",
        },
        en: {
          question: "How much is the uniform and is it mandatory?",
          answer: "The uniform is mandatory and costs €15, paid only once (not monthly). You don't need it for your free first training day.",
        },
        de: {
          question: "Was kostet die Uniform und ist sie obligatorisch?",
          answer: "Die Uniform ist obligatorisch und kostet 15€, einmalig (nicht monatlich). Für deinen kostenlosen ersten Trainingstag brauchst du sie nicht.",
        },
      },
    },
    {
      t: {
        sq: {
          question: "Cili është orari i saktë sipas moshës?",
          answer: "E Martë, E Enjte, E Shtunë:\nFëmijët (5-9 vjeç): 19:00-20:00\nTë Rinjtë (10-17 vjeç): 20:00-21:00\nTë Rriturit (18+ vjeç): 21:00-22:00",
        },
        en: {
          question: "What is the exact schedule by age?",
          answer: "Tuesday, Thursday, Saturday:\nKids (5-9 years): 19:00-20:00\nTeens (10-17 years): 20:00-21:00\nAdults (18+ years): 21:00-22:00",
        },
        de: {
          question: "Wie ist der genaue Zeitplan nach Alter?",
          answer: "Dienstag, Donnerstag, Samstag:\nKids (5-9 Jahre): 19:00-20:00\nJugendliche (10-17 Jahre): 20:00-21:00\nErwachsene (18+ Jahre): 21:00-22:00",
        },
      },
    },
    {
      t: {
        sq: {
          question: "A pranohen vajzat/femrat?",
          answer: "Vajzat pranohen vetëm në grupin e fëmijëve, deri në moshën 9 vjeçare. Për grupmoshat më të mëdha (Të Rinj dhe Të Rritur) aktualisht kemi vetëm grupe për djem/meshkuj.",
        },
        en: {
          question: "Are girls/women accepted?",
          answer: "Girls are accepted only in the Kids group, up to age 9. For the older age groups (Teens and Adults) we currently only have groups for boys/men.",
        },
        de: {
          question: "Werden Mädchen/Frauen aufgenommen?",
          answer: "Mädchen werden nur in der Kids-Gruppe aufgenommen, bis zum Alter von 9 Jahren. Für die älteren Altersgruppen (Jugendliche und Erwachsene) haben wir aktuell nur Gruppen für Jungen/Männer.",
        },
      },
    },
  ];

  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    for (let i = 0; i < faqData.length; i++) {
      const item = await prisma.faqItem.create({ data: { order: i } });
      for (const locale of Object.keys(faqData[i].t) as Locale[]) {
        const { question, answer } = faqData[i].t[locale];
        await prisma.faqTranslation.create({
          data: { faqId: item.id, locale, question, answer },
        });
      }
    }
  }

  // ---------- Contact info ----------
  await prisma.contactInfo.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      address: "Rr. Sinan Sahiti 79",
      city: "Ferizaj, Kosovë",
      phone: "048 880 404",
      email: "info@samirwingtsun.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      mapEmbedUrl:
        "https://www.google.com/maps?q=" +
        encodeURIComponent("Rr. Sinan Sahiti 79, Ferizaj, Kosovo") +
        "&output=embed",
    },
  });

  // ---------- Gallery ----------
  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    const images = [
      { url: "/images/hero-training.jpg", caption: "Trajnim Wing Tsun", category: "hall" },
      { url: "/images/hero-dark-dummy.jpg", caption: "Mok Yan Jong — Kukulla e drurit", category: "hall" },
      { url: "/images/kids-training.jpg", caption: "Trajnim për fëmijë", category: "group" },
      { url: "/images/flyer-light.jpg", caption: "Samir Wing Tsun System, Ferizaj", category: "general" },
    ];
    for (let i = 0; i < images.length; i++) {
      await prisma.galleryImage.create({ data: { ...images[i], order: i } });
    }
  }

  // ---------- Pricing plans ----------
  const pricingData: { t: Record<Locale, { name: string; price: string; period: string; features: string }> }[] = [
    {
      t: {
        sq: {
          name: "Fëmijët (5-9 vjeç)",
          price: "30€",
          period: "/ muaj",
          features: "Stërvitje: E Martë, E Enjte, E Shtunë — 19:00-20:00\nDita e parë falas\nUniformë obligative: 15€ (një herë)\nRrit koncentrimin dhe vetëbesimin\nZhvillon disiplinën dhe respektin\nE hapur për djem dhe vajza (vajzat deri në moshën 9 vjeç)",
        },
        en: {
          name: "Kids (5-9 years)",
          price: "€30",
          period: "/ month",
          features: "Training: Tue, Thu, Sat — 19:00-20:00\nFirst day free\nMandatory uniform: €15 (one-time)\nBuilds focus and self-confidence\nDevelops discipline and respect\nOpen to boys and girls (girls up to age 9)",
        },
        de: {
          name: "Kids (5-9 Jahre)",
          price: "30€",
          period: "/ Monat",
          features: "Training: Di, Do, Sa — 19:00-20:00\nErster Tag kostenlos\nObligatorische Uniform: 15€ (einmalig)\nStärkt Konzentration und Selbstvertrauen\nFördert Disziplin und Respekt\nOffen für Jungen und Mädchen (Mädchen bis 9 Jahre)",
        },
      },
    },
    {
      t: {
        sq: {
          name: "Të Rinjtë (10-17 vjeç)",
          price: "30€",
          period: "/ muaj",
          features: "Stërvitje: E Martë, E Enjte, E Shtunë — 20:00-21:00\nDita e parë falas\nUniformë obligative: 15€ (një herë)\nFokus te vetëmbrojtja praktike\nZhvillim fizik dhe mendor\nAktualisht vetëm për djem",
        },
        en: {
          name: "Teens (10-17 years)",
          price: "€30",
          period: "/ month",
          features: "Training: Tue, Thu, Sat — 20:00-21:00\nFirst day free\nMandatory uniform: €15 (one-time)\nFocus on practical self-defense\nPhysical and mental development\nCurrently boys only",
        },
        de: {
          name: "Jugendliche (10-17 Jahre)",
          price: "30€",
          period: "/ Monat",
          features: "Training: Di, Do, Sa — 20:00-21:00\nErster Tag kostenlos\nObligatorische Uniform: 15€ (einmalig)\nFokus auf praktische Selbstverteidigung\nKörperliche und geistige Entwicklung\nAktuell nur für Jungen",
        },
      },
    },
    {
      t: {
        sq: {
          name: "Të Rriturit (18+ vjeç)",
          price: "30€",
          period: "/ muaj",
          features: "Stërvitje: E Martë, E Enjte, E Shtunë — 21:00-22:00\nDita e parë falas\nUniformë obligative: 15€ (një herë)\nTeknika reale vetëmbrojtjeje\nKondicion fizik dhe çlirim stresi\nAktualisht vetëm për meshkuj",
        },
        en: {
          name: "Adults (18+ years)",
          price: "€30",
          period: "/ month",
          features: "Training: Tue, Thu, Sat — 21:00-22:00\nFirst day free\nMandatory uniform: €15 (one-time)\nReal self-defense techniques\nFitness and stress relief\nCurrently male only",
        },
        de: {
          name: "Erwachsene (18+ Jahre)",
          price: "30€",
          period: "/ Monat",
          features: "Training: Di, Do, Sa — 21:00-22:00\nErster Tag kostenlos\nObligatorische Uniform: 15€ (einmalig)\nReale Selbstverteidigungstechniken\nFitness und Stressabbau\nAktuell nur für Männer",
        },
      },
    },
  ];

  const pricingCount = await prisma.pricingPlan.count();
  if (pricingCount === 0) {
    for (let i = 0; i < pricingData.length; i++) {
      const plan = await prisma.pricingPlan.create({ data: { order: i } });
      for (const locale of Object.keys(pricingData[i].t) as Locale[]) {
        const { name, price, period, features } = pricingData[i].t[locale];
        await prisma.pricingPlanTranslation.create({
          data: { planId: plan.id, locale, name, price, period, features },
        });
      }
    }
  }

  // ---------- About page ----------
  await upsertSiteText("about_page", {
    sq: {
      title: "Rreth Samir Wing Tsun System",
      body: "Samir Wing Tsun System është një shkollë e artit të vetëmbrojtjes Wing Tsun në Ferizaj, e themeluar dhe udhëhequr nga Sifu Samir Ibishi. Që nga hapja, kemi trajnuar qindra studentë — nga fëmijë deri te të rritur — duke ndërtuar jo vetëm aftësi fizike, por edhe disiplinë, respekt dhe vetëbesim.\n\nMisioni ynë është t'i ofrojmë çdo studenti mjetet për t'u mbrojtur, për t'u ndjerë më të fortë dhe për të jetuar një jetë më të shëndetshme e të balancuar.",
    },
    en: {
      title: "About Samir Wing Tsun System",
      body: "Samir Wing Tsun System is a Wing Tsun self-defense school in Ferizaj, founded and led by Sifu Samir Ibishi. Since opening, we have trained hundreds of students — from kids to adults — building not just physical skill, but discipline, respect and self-confidence.\n\nOur mission is to give every student the tools to protect themselves, feel stronger, and live a healthier, more balanced life.",
    },
    de: {
      title: "Über Samir Wing Tsun System",
      body: "Samir Wing Tsun System ist eine Wing-Tsun-Selbstverteidigungsschule in Ferizaj, gegründet und geleitet von Sifu Samir Ibishi. Seit der Eröffnung haben wir Hunderte von Schülern trainiert — vom Kind bis zum Erwachsenen — und dabei nicht nur körperliche Fähigkeiten, sondern auch Disziplin, Respekt und Selbstvertrauen aufgebaut.\n\nUnsere Mission ist es, jedem Schüler die Werkzeuge zu geben, sich zu schützen, sich stärker zu fühlen und ein gesünderes, ausgeglicheneres Leben zu führen.",
    },
  });

  console.log("Seed complete. Admin login ->", username, "/", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
