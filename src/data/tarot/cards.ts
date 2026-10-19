import type { TarotCard } from "@/lib/tarot/types";

/**
 * 타로 78장 데이터 (웨이트–스미스 순서: 8 힘, 11 정의).
 *
 * - upright / reversed: 한국어 키워드와 풀이(직접 작성).
 * - waite: A. E. Waite, "The Pictorial Key to the Tarot" (1911, 퍼블릭 도메인)의
 *   점술 의미(Divinatory Meanings / Reversed) 원문을 sacred-texts.com 전사본에서
 *   그대로 옮긴 것. 오탈자도 출처 페이지 그대로 두었다.
 *   컵 2는 본문 항목에 역방향이 없어, Part III §4 "Some Additional Meanings of the Lesser Arcana"의
 *   "Reversed: Passion."을 옮겼다 (Wikisource 1910년판 전사본에서 확인).
 */
export const CARDS: readonly TarotCard[] = [
  {
    id: "major-00",
    arcana: "major",
    suit: null,
    number: 0,
    nameEn: "The Fool",
    nameKo: "바보",
    upright: {
      keywords: ["새로운 출발", "자유로움", "순수함", "모험", "가능성"],
      meaning:
        "익숙한 틀을 벗어나 새로운 길로 첫발을 내딛는 시기예요. 계산보다 호기심과 직감이 앞서는 만큼 가벼운 마음으로 시도해 볼 만해요. 다만 발밑을 살피는 최소한의 주의는 챙겨 두면 좋아요.",
    },
    reversed: {
      keywords: ["부주의", "무모함", "무관심", "산만함"],
      meaning:
        "준비 없이 뛰어들거나, 반대로 두려움 때문에 아예 출발하지 못하는 모습일 수 있어요. 주의가 흩어져 중요한 것을 놓치기 쉬운 때이니 우선순위를 한 번 정리해 보세요. 작은 계획 하나만 세워도 흐름이 한결 안정돼요.",
    },
    waite: {
      upright:
        "Folly, mania, extravagance, intoxication, delirium, frenzy, bewrayment.",
      reversed:
        "Negligence, absence, distribution, carelessness, apathy, nullity, vanity.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-01",
    arcana: "major",
    suit: null,
    number: 1,
    nameEn: "The Magician",
    nameKo: "마법사",
    upright: {
      keywords: ["의지", "재능", "실행력", "자신감", "수완"],
      meaning:
        "가진 능력과 자원을 한데 모아 원하는 것을 현실로 만들어 갈 수 있는 때예요. 말과 행동에 설득력이 실리고, 상황을 다루는 수완도 빛을 발해요. 목표를 분명히 정하고 바로 실행에 옮겨 보세요.",
    },
    reversed: {
      keywords: ["재능 낭비", "속임수", "자신감 부족", "불안"],
      meaning:
        "능력이 있어도 방향을 잡지 못해 힘이 분산되거나, 말과 행동이 엇갈릴 수 있어요. 누군가의 그럴듯한 말에 휘둘리지 않도록 사실을 차분히 확인해 보세요. 스스로를 과소평가하고 있지는 않은지도 돌아볼 때예요.",
    },
    waite: {
      upright:
        "Skill, diplomacy, address, subtlety; sickness, pain, loss, disaster, snares of enemies; self-confidence, will; the Querent, if male.",
      reversed:
        "Physician, Magus, mental disease, disgrace, disquiet.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-02",
    arcana: "major",
    suit: null,
    number: 2,
    nameEn: "The High Priestess",
    nameKo: "여사제",
    upright: {
      keywords: ["직관", "비밀", "내면의 지혜", "침묵", "통찰"],
      meaning:
        "아직 드러나지 않은 것이 있으니 서두르기보다 조용히 지켜보며 내면의 목소리에 귀 기울일 때예요. 겉으로 보이는 정보 너머를 읽어 내는 직관이 예리해져 있어요. 배우고 탐구하는 일에도 좋은 흐름이에요.",
    },
    reversed: {
      keywords: ["피상적 지식", "감정 과잉", "직관 무시", "자만"],
      meaning:
        "깊이 이해하기 전에 겉핥기식 판단을 내리거나, 감정이 앞서 내면의 신호를 놓치기 쉬워요. 안다고 생각한 것을 다시 한 번 점검해 보면 좋아요. 잠시 혼자만의 시간을 가지며 마음을 가라앉혀 보세요.",
    },
    waite: {
      upright:
        "Secrets, mystery, the future as yet unrevealed; the woman who interests the Querent, if male; the Querent herself, if female; silence, tenacity; mystery, wisdom, science.",
      reversed:
        "Passion, moral or physical ardour, conceit, surface knowledge.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-03",
    arcana: "major",
    suit: null,
    number: 3,
    nameEn: "The Empress",
    nameKo: "여황제",
    upright: {
      keywords: ["풍요", "결실", "돌봄", "창조성", "아름다움"],
      meaning:
        "정성껏 가꾼 것이 무르익어 열매를 맺는 풍요로운 흐름이에요. 감각과 창조성이 살아나고, 주변을 따뜻하게 돌보는 힘도 커져요. 몸과 마음을 편안히 하면서 자연스럽게 자라나도록 두어 보세요.",
    },
    reversed: {
      keywords: ["정체", "의존", "과잉보호", "망설임"],
      meaning:
        "에너지가 바깥으로만 흘러 정작 나를 돌보지 못하거나, 지나친 보살핌이 상대에게 부담이 될 수 있어요. 마음이 이리저리 흔들려 결정을 미루게 되기도 해요. 나를 채우는 시간을 먼저 마련하면 얽힌 상황도 한결 선명해져요.",
    },
    waite: {
      upright:
        "Fruitfulness, action, initiative, length of days; the unknown, clandestine; also difficulty, doubt, ignorance.",
      reversed:
        "Light, truth, the unravelling of involved matters, public rejoicings; according to another reading, vacillation.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-04",
    arcana: "major",
    suit: null,
    number: 4,
    nameEn: "The Emperor",
    nameKo: "황제",
    upright: {
      keywords: ["안정", "권위", "질서", "책임", "보호"],
      meaning:
        "원칙과 구조를 세워 상황을 단단하게 다질 수 있는 때예요. 책임감 있게 결정하고 이끌어 가는 리더십이 힘을 얻어요. 계획을 체계적으로 정리하면 오래가는 기반이 만들어져요.",
    },
    reversed: {
      keywords: ["경직", "통제 욕구", "미숙함", "혼란"],
      meaning:
        "규칙에 지나치게 매달리거나 모든 것을 통제하려다 오히려 관계가 경직될 수 있어요. 반대로 중심이 흔들려 결정을 미루는 모습으로 나타나기도 해요. 단호함과 너그러움 사이의 균형을 찾아보세요.",
    },
    waite: {
      upright:
        "Stability, power, protection, realization; a great person; aid, reason, conviction; also authority and will.",
      reversed:
        "Benevolence, compassion, credit; also confusion to enemies, obstruction, immaturity.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-05",
    arcana: "major",
    suit: null,
    number: 5,
    nameEn: "The Hierophant",
    nameKo: "교황",
    upright: {
      keywords: ["전통", "가르침", "신뢰", "규범", "조언"],
      meaning:
        "검증된 방식과 전통, 믿을 만한 스승이나 조언자에게서 길을 찾을 수 있는 때예요. 공동체의 규범 안에서 안정감과 소속감을 얻기 쉬워요. 약속이나 공식적인 결속을 다지기에도 좋은 흐름이에요.",
    },
    reversed: {
      keywords: ["관습 탈피", "독자적 판단", "지나친 순응", "형식주의"],
      meaning:
        "정해진 틀이 답답하게 느껴지거나, 남의 기대에 맞추느라 나다운 판단을 미루고 있을 수 있어요. 관습을 무조건 따르기보다 그 의미를 스스로 따져 보면 좋아요. 지나치게 착하게만 굴다 지치지 않도록 경계도 세워 보세요.",
    },
    waite: {
      upright:
        "Marriage, alliance, captivity, servitude; by another account, mercy and goodness; inspiration; the man to whom the Querent has recourse.",
      reversed:
        "Society, good understanding, concord, overkindness, weakness.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-06",
    arcana: "major",
    suit: null,
    number: 6,
    nameEn: "The Lovers",
    nameKo: "연인",
    upright: {
      keywords: ["사랑", "조화", "끌림", "선택", "가치관"],
      meaning:
        "마음이 끌리는 대상과 깊이 연결되며 조화를 이루는 흐름이에요. 관계뿐 아니라 중요한 선택 앞에서 내가 진정으로 소중히 여기는 가치가 무엇인지 드러나요. 진심에 따라 고른 길이 시련을 넘어서는 힘이 돼요.",
    },
    reversed: {
      keywords: ["불균형", "엇갈림", "성급한 선택", "갈등"],
      meaning:
        "관계의 균형이 흐트러지거나 서로의 기대가 엇갈릴 수 있어요. 충동적으로 내린 결정이 생각만큼 풀리지 않을 수도 있으니 한 걸음 물러서서 살펴보세요. 솔직한 대화가 엉킨 마음을 푸는 출발점이 돼요.",
    },
    waite: {
      upright:
        "Attraction, love, beauty, trials overcome.",
      reversed:
        "Failure, foolish designs. Another account speaks of marriage frustrated and contrarieties of all kinds.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-07",
    arcana: "major",
    suit: null,
    number: 7,
    nameEn: "The Chariot",
    nameKo: "전차",
    upright: {
      keywords: ["승리", "추진력", "의지", "전진", "통제"],
      meaning:
        "상반된 힘을 하나로 다잡아 목표를 향해 힘차게 나아가는 때예요. 강한 의지와 집중력이 장애물을 넘어 성과로 이어져요. 방향만 분명하다면 속도를 내도 좋아요.",
    },
    reversed: {
      keywords: ["방향 상실", "충돌", "과욕", "좌절"],
      meaning:
        "힘은 넘치는데 방향이 흐트러져 부딪힘이 잦아질 수 있어요. 이기려는 마음이 앞서면 사소한 다툼이 커지기 쉬우니 속도를 조금 늦춰 보세요. 고삐를 다시 쥐고 목표를 재정비하면 흐름을 되찾을 수 있어요.",
    },
    waite: {
      upright:
        "Succour, providence also war, triumph, presumption, vengeance, trouble.",
      reversed:
        "Riot, quarrel, dispute, litigation, defeat.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-08",
    arcana: "major",
    suit: null,
    number: 8,
    nameEn: "Strength",
    nameKo: "힘",
    upright: {
      keywords: ["용기", "인내", "부드러운 힘", "자제력", "너그러움"],
      meaning:
        "억누르기보다 부드럽게 다독이는 방식으로 어려움을 다스리는 힘이 있는 때예요. 차분한 용기와 인내가 주변의 신뢰를 이끌어 내요. 스스로를 믿고 꾸준히 버티면 좋은 결과로 이어져요.",
    },
    reversed: {
      keywords: ["자신감 저하", "조급함", "힘의 남용", "불화"],
      meaning:
        "마음이 약해져 스스로를 의심하거나, 반대로 힘으로 상황을 밀어붙이려 할 수 있어요. 감정이 앞서면 관계에 불필요한 마찰이 생기기 쉬워요. 나를 몰아붙이기보다 다정하게 대하는 것부터 시작해 보세요.",
    },
    waite: {
      upright:
        "Power, energy, action, courage, magnanimity; also complete success and honours.",
      reversed:
        "Despotism, abuse if power, weakness, discord, sometimes even disgrace.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-09",
    arcana: "major",
    suit: null,
    number: 9,
    nameEn: "The Hermit",
    nameKo: "은둔자",
    upright: {
      keywords: ["성찰", "고독", "신중함", "탐구", "내면의 빛"],
      meaning:
        "바깥의 소란에서 잠시 물러나 홀로 생각을 정리하며 답을 찾는 시기예요. 신중하게 살피고 깊이 탐구할수록 스스로의 길이 또렷해져요. 혼자 있는 시간을 외로움이 아닌 충전의 기회로 삼아 보세요.",
    },
    reversed: {
      keywords: ["고립", "지나친 경계", "회피", "숨김"],
      meaning:
        "성찰이 지나쳐 사람들과 멀어지거나, 두려움 때문에 필요한 행동까지 미루고 있을 수 있어요. 마음을 감추기만 하면 오해가 쌓이기 쉬워요. 믿을 만한 사람에게 조금씩 마음을 열어 보세요.",
    },
    waite: {
      upright:
        "Prudence, circumspection; also and especially treason, dissimulation, roguery, corruption.",
      reversed:
        "Concealment, disguise, policy, fear, unreasoned caution.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-10",
    arcana: "major",
    suit: null,
    number: 10,
    nameEn: "Wheel of Fortune",
    nameKo: "운명의 수레바퀴",
    upright: {
      keywords: ["전환점", "행운", "흐름", "기회", "순환"],
      meaning:
        "상황이 새로운 국면으로 돌아서는 전환점이에요. 예상하지 못한 기회나 반가운 소식이 찾아올 수 있어요. 흐름을 거스르기보다 유연하게 올라타면 좋은 방향으로 이어져요.",
    },
    reversed: {
      keywords: ["지연", "엇갈린 타이밍", "과잉", "변화 거부"],
      meaning:
        "일이 생각한 타이밍과 어긋나거나 바뀌는 흐름을 받아들이기 어려울 수 있어요. 무언가가 지나치게 많아져 오히려 부담이 되기도 해요. 지금은 흐름이 다시 돌기를 기다리며 내가 다룰 수 있는 일에 집중해 보세요.",
    },
    waite: {
      upright:
        "Destiny, fortune, success, elevation, luck, felicity.",
      reversed:
        "Increase, abundance, superfluity.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-11",
    arcana: "major",
    suit: null,
    number: 11,
    nameEn: "Justice",
    nameKo: "정의",
    upright: {
      keywords: ["공정", "균형", "진실", "책임", "합리적 판단"],
      meaning:
        "사실과 원칙에 따라 공정한 결론이 내려지는 흐름이에요. 지금까지의 선택과 행동이 그에 걸맞은 결과로 돌아와요. 감정보다 객관적인 기준을 세우고 정직하게 판단해 보세요.",
    },
    reversed: {
      keywords: ["불균형", "편견", "책임 회피", "복잡한 절차"],
      meaning:
        "한쪽으로 치우친 판단이나 지나치게 엄격한 잣대가 문제를 키울 수 있어요. 절차나 규정이 얽혀 일이 복잡해지기도 해요. 내 몫의 책임을 인정하고 여러 입장을 고르게 들어 보세요.",
    },
    waite: {
      upright:
        "Equity, rightness, probity, executive; triumph of the deserving side in law.",
      reversed:
        "Law in all its departments, legal complications, bigotry, bias, excessive severity.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-12",
    arcana: "major",
    suit: null,
    number: 12,
    nameEn: "The Hanged Man",
    nameKo: "매달린 사람",
    upright: {
      keywords: ["관점 전환", "기다림", "내려놓음", "희생", "통찰"],
      meaning:
        "잠시 멈춰서 다른 각도로 바라볼 때 새로운 통찰이 열리는 시기예요. 당장의 결과를 내려놓고 기다리는 것이 오히려 지혜로운 선택이 될 수 있어요. 무엇을 내어 주고 무엇을 얻을지 차분히 헤아려 보세요.",
    },
    reversed: {
      keywords: ["정체", "이기심", "휩쓸림", "무의미한 희생"],
      meaning:
        "변화가 필요한데도 같은 자리에 머물거나 주변 분위기에 휩쓸려 결정을 미루고 있을 수 있어요. 참는 것이 지나쳐 지치거나, 반대로 내 입장만 고집하게 되기도 해요. 무엇을 위해 버티고 있는지 목적을 다시 확인해 보세요.",
    },
    waite: {
      upright:
        "Wisdom, circumspection, discernment, trials, sacrifice, intuition, divination, prophecy.",
      reversed:
        "Selfishness, the crowd, body politic.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-13",
    arcana: "major",
    suit: null,
    number: 13,
    nameEn: "Death",
    nameKo: "죽음",
    upright: {
      keywords: ["끝과 시작", "변화", "정리", "전환", "재탄생"],
      meaning:
        "하나의 국면이 마무리되고 새로운 단계로 넘어가는 변화의 카드예요. 실제 죽음을 뜻하기보다 더는 맞지 않는 것을 정리하고 떠나보내는 과정을 말해요. 끝을 받아들일 때 비로소 새로운 시작을 위한 자리가 생겨요.",
    },
    reversed: {
      keywords: ["변화 거부", "정체", "미련", "무기력"],
      meaning:
        "끝내야 할 일을 붙잡고 있거나 변화를 미루면서 무기력함이 이어질 수 있어요. 익숙함에 머무르고 싶은 마음은 자연스럽지만, 오래 끌수록 지치기 쉬워요. 작은 것부터 하나씩 정리하며 다음 걸음을 준비해 보세요.",
    },
    waite: {
      upright:
        "End, mortality, destruction, corruption also, for a man, the loss of a benefactor for a woman, many contrarieties; for a maid, failure of marriage projects.",
      reversed:
        "Inertia, sleep, lethargy, petrifaction, somnambulism; hope destroyed.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-14",
    arcana: "major",
    suit: null,
    number: 14,
    nameEn: "Temperance",
    nameKo: "절제",
    upright: {
      keywords: ["균형", "절제", "조화", "인내", "조율"],
      meaning:
        "서로 다른 요소를 알맞게 섞어 조화를 이루는 때예요. 극단을 피하고 꾸준히 조율해 가면 상황이 자연스럽게 안정돼요. 서두르지 않는 인내가 가장 좋은 결과를 만들어요.",
    },
    reversed: {
      keywords: ["불균형", "과잉", "조급함", "이해 충돌"],
      meaning:
        "한쪽으로 치우치거나 무리하게 속도를 내면서 균형이 깨지기 쉬워요. 서로의 이해관계가 엇갈려 협력이 삐걱거릴 수도 있어요. 생활 리듬과 우선순위를 차분히 다시 맞춰 보세요.",
    },
    waite: {
      upright:
        "Economy, moderation, frugality, management, accommodation.",
      reversed:
        "Things connected with churches, religions, sects, the priesthood, sometimes even the priest who will marry the Querent; also disunion, unfortunate combinations, competing interests.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-15",
    arcana: "major",
    suit: null,
    number: 15,
    nameEn: "The Devil",
    nameKo: "악마",
    upright: {
      keywords: ["집착", "유혹", "속박", "욕망", "강한 에너지"],
      meaning:
        "강한 욕망이나 습관, 관계에 묶여 스스로를 옭아매고 있을 수 있어요. 이 에너지 자체가 나쁜 것은 아니지만, 휘둘리면 자유를 잃기 쉬워요. 무엇이 나를 붙잡고 있는지 솔직하게 들여다보는 것이 첫걸음이에요.",
    },
    reversed: {
      keywords: ["해방", "자각", "벗어남", "약해진 의지"],
      meaning:
        "나를 묶던 것을 알아차리고 조금씩 벗어나기 시작하는 흐름이에요. 다만 의지가 약해지면 같은 패턴으로 되돌아가기 쉬우니 작은 변화를 꾸준히 이어 가세요. 시야를 넓히면 생각보다 선택지가 많다는 것을 알게 돼요.",
    },
    waite: {
      upright:
        "Ravage, violence, vehemence, extraordinary efforts, force, fatality; that which is predestined but is not for this reason evil.",
      reversed:
        "Evil fatality, weakness, pettiness, blindness.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-16",
    arcana: "major",
    suit: null,
    number: 16,
    nameEn: "The Tower",
    nameKo: "탑",
    upright: {
      keywords: ["급변", "충격", "붕괴", "깨달음", "해방"],
      meaning:
        "예상하지 못한 일로 기존의 구조가 흔들리는 급격한 변화의 카드예요. 당황스러울 수 있지만, 불안정한 토대가 드러나면서 진실을 마주하게 돼요. 무너진 자리를 정리하면 더 단단한 기반을 다시 세울 수 있어요.",
    },
    reversed: {
      keywords: ["변화 회피", "잔여 충격", "억눌림", "점진적 변화"],
      meaning:
        "피하고 싶은 변화를 미루면서 긴장이 계속 쌓이고 있을 수 있어요. 큰 충격은 아니더라도 답답함과 억눌린 느낌이 이어지기 쉬워요. 무너질 것은 스스로 먼저 정리할 때 부담이 훨씬 줄어들어요.",
    },
    waite: {
      upright:
        "Misery, distress, indigence, adversity, calamity, disgrace, deception, ruin. It is a card in particular of unforeseen catastrophe.",
      reversed:
        "According to one account, the same in a lesser degree also oppression, imprisonment, tyranny.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-17",
    arcana: "major",
    suit: null,
    number: 17,
    nameEn: "The Star",
    nameKo: "별",
    upright: {
      keywords: ["희망", "회복", "영감", "평온", "믿음"],
      meaning:
        "어려운 시간을 지나 다시 희망이 비치기 시작하는 흐름이에요. 마음이 맑아지고 앞날에 대한 영감과 믿음이 되살아나요. 서두르지 말고 나를 회복시키는 일에 정성을 들여 보세요.",
    },
    reversed: {
      keywords: ["낙담", "자신감 상실", "막연함", "자만"],
      meaning:
        "기대가 꺾이면서 의욕이 떨어지거나 앞날이 막연하게 느껴질 수 있어요. 반대로 지나친 자신감 때문에 현실을 놓치기도 해요. 작은 목표 하나를 이루며 다시 믿음을 쌓아 보세요.",
    },
    waite: {
      upright:
        "Loss, theft, privation, abandonment; another reading says-hope and bright prospects,",
      reversed:
        "Arrogance, haughtiness, impotence.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-18",
    arcana: "major",
    suit: null,
    number: 18,
    nameEn: "The Moon",
    nameKo: "달",
    upright: {
      keywords: ["불안", "혼란", "환상", "무의식", "숨은 진실"],
      meaning:
        "상황이 흐릿하게 보이고 막연한 불안이 커지기 쉬운 때예요. 겉으로 드러난 것과 실제가 다를 수 있으니 섣불리 결론 내리지 마세요. 꿈이나 직감이 주는 신호를 참고하되, 사실 확인을 함께 해 보세요.",
    },
    reversed: {
      keywords: ["혼란 해소", "진실 드러남", "변덕", "작은 오해"],
      meaning:
        "안개가 조금씩 걷히며 감춰졌던 사실이 드러나기 시작해요. 다만 마음이 쉽게 흔들려 작은 오해나 착각이 남을 수 있어요. 감정의 기복을 살피며 한 번 더 확인하는 습관을 들여 보세요.",
    },
    waite: {
      upright:
        "Hidden enemies, danger, calumny, darkness, terror, deception, occult forces, error.",
      reversed:
        "Instability, inconstancy, silence, lesser degrees of deception and error.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-19",
    arcana: "major",
    suit: null,
    number: 19,
    nameEn: "The Sun",
    nameKo: "태양",
    upright: {
      keywords: ["기쁨", "성공", "활력", "만족", "명확함"],
      meaning:
        "모든 것이 밝게 드러나고 기쁨과 활력이 넘치는 흐름이에요. 노력한 일이 좋은 결과로 이어지고 관계에서도 따뜻한 만족감을 느끼기 쉬워요. 자신 있게 나를 드러내고 행복을 나눠 보세요.",
    },
    reversed: {
      keywords: ["약해진 기쁨", "지연된 성공", "과신", "흐린 전망"],
      meaning:
        "좋은 흐름은 이어지지만 기대만큼 선명하지 않거나 조금 늦어질 수 있어요. 지나친 낙관으로 세부 사항을 놓치지 않도록 주의해 보세요. 작은 기쁨을 알아차릴수록 다시 밝은 기운이 차올라요.",
    },
    waite: {
      upright:
        "Material happiness, fortunate marriage, contentment.",
      reversed:
        "The same in a lesser sense.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-20",
    arcana: "major",
    suit: null,
    number: 20,
    nameEn: "Judgement",
    nameKo: "심판",
    upright: {
      keywords: ["부활", "각성", "새로운 소명", "결단", "평가"],
      meaning:
        "지난 경험을 돌아보고 정리하며 새로운 단계로 도약하는 때예요. 마음 깊은 곳에서 부르는 소리에 응답하며 다시 일어서게 돼요. 과거를 정직하게 평가하고 다음 선택에 반영해 보세요.",
    },
    reversed: {
      keywords: ["자기 의심", "망설임", "미뤄진 결정", "후회"],
      meaning:
        "스스로에 대한 의심 때문에 중요한 결정을 계속 미루고 있을 수 있어요. 과거의 실수에 머무르기보다 그 안에서 배울 점을 찾아보세요. 충분히 숙고했다면 이제는 결단을 내릴 때예요.",
    },
    waite: {
      upright:
        "Change of position, renewal, outcome. Another account specifies total loss though lawsuit.",
      reversed:
        "Weakness, pusillanimity, simplicity; also deliberation, decision, sentence.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "major-21",
    arcana: "major",
    suit: null,
    number: 21,
    nameEn: "The World",
    nameKo: "세계",
    upright: {
      keywords: ["완성", "성취", "통합", "여행", "새로운 무대"],
      meaning:
        "하나의 여정이 아름답게 마무리되고 큰 성취를 이루는 카드예요. 그동안의 노력이 인정받고 더 넓은 세계로 나아갈 문이 열려요. 이룬 것을 충분히 누리며 다음 장을 준비해 보세요.",
    },
    reversed: {
      keywords: ["미완성", "정체", "마무리 부족", "제자리걸음"],
      meaning:
        "끝이 거의 보이는데 마지막 한 걸음이 잘 떼어지지 않을 수 있어요. 익숙한 자리에 머무르려는 마음이 변화를 늦추기도 해요. 남은 과제를 차근차근 마무리하면 다음 단계가 열려요.",
    },
    waite: {
      upright:
        "Assured success, recompense, voyage, route, emigration, flight, change of place.",
      reversed:
        "Inertia, fixity, stagnation, permanence.",
      source: "https://sacred-texts.com/tarot/pkt/pkt0303.htm",
    },
  },
  {
    id: "wands-01",
    arcana: "minor",
    suit: "wands",
    number: 1,
    nameEn: "Ace of Wands",
    nameKo: "완드 에이스",
    upright: {
      keywords: ["시작", "열정", "창의성", "영감", "잠재력"],
      meaning:
        "새로운 일이나 아이디어가 힘차게 싹트는 출발점이에요. 열정과 창의력이 솟아나 무엇이든 시작해 보고 싶은 에너지가 가득해요. 떠오른 영감을 바로 작은 행동으로 옮겨 보세요.",
    },
    reversed: {
      keywords: ["지연", "의욕 저하", "흐지부지", "막힘"],
      meaning:
        "시작하려는 마음은 있지만 실행이 자꾸 미뤄지거나 열정이 금세 식을 수 있어요. 준비가 덜 된 상태라면 잠시 숨을 고르는 것도 괜찮아요. 처음 끌렸던 이유를 떠올리며 다시 불씨를 살려 보세요.",
    },
    waite: {
      upright:
        "Creation, invention, enterprise, the powers which result in these; principle, beginning, source; birth, family, origin, and in a sense the virility which is behind them; the starting point of enterprises; according to another account, money, fortune, inheritance.",
      reversed:
        "Fall, decadence, ruin, perdition, to perish also a certain clouded joy.",
      source: "https://sacred-texts.com/tarot/pkt/pktwaac.htm",
    },
  },
  {
    id: "wands-02",
    arcana: "minor",
    suit: "wands",
    number: 2,
    nameEn: "Two of Wands",
    nameKo: "완드 2",
    upright: {
      keywords: ["계획", "비전", "선택", "확장", "가능성 탐색"],
      meaning:
        "이미 손에 쥔 것을 바탕으로 더 넓은 세계를 내다보며 계획을 세우는 때예요. 가진 것이 넉넉해도 마음 한편이 허전하다면 진짜 원하는 것이 무엇인지 물어볼 신호예요. 큰 그림을 그리되 첫 단계는 구체적으로 정해 보세요.",
    },
    reversed: {
      keywords: ["두려움", "계획 차질", "망설임", "뜻밖의 변수"],
      meaning:
        "새로운 길에 대한 두려움 때문에 익숙한 자리에서 벗어나지 못하고 있을 수 있어요. 예상하지 못한 변수가 생겨 계획을 손봐야 할 수도 있어요. 놀란 마음을 가라앉히고 대안을 하나씩 정리해 보세요.",
    },
    waite: {
      upright:
        "Between the alternative readings there is no marriage possible; on the one hand, riches, fortune, magnificence; on the other, physical suffering, disease, chagrin, sadness, mortification. The design gives one suggestion; here is a lord overlooking his dominion and alternately contemplating a globe; it looks like the malady, the mortification, the sadness of Alexander amidst the grandeur of this world's wealth.",
      reversed:
        "Surprise, wonder, enchantment, emotion, trouble, fear.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa02.htm",
    },
  },
  {
    id: "wands-03",
    arcana: "minor",
    suit: "wands",
    number: 3,
    nameEn: "Three of Wands",
    nameKo: "완드 3",
    upright: {
      keywords: ["확장", "전망", "협력", "진척", "기회"],
      meaning:
        "뿌린 씨앗이 움직이기 시작해 더 큰 기회를 기대할 수 있는 흐름이에요. 시야를 넓히고 멀리 내다보며 준비하면 성과가 따라와요. 믿을 만한 협력자와 손잡으면 일이 한결 수월해져요.",
    },
    reversed: {
      keywords: ["지연", "기대 어긋남", "숨 고르기", "재점검"],
      meaning:
        "기대했던 결과가 늦어지거나 계획이 생각처럼 뻗어 나가지 않을 수 있어요. 그래도 고된 시기가 한풀 꺾이며 한숨 돌릴 여유가 생기기도 해요. 너무 먼 곳만 보지 말고 지금 할 수 있는 준비부터 점검해 보세요.",
    },
    waite: {
      upright:
        "He symbolizes established strength, enterprise, effort, trade, commerce, discovery; those are his ships, bearing his merchandise, which are sailing over the sea. The card also signifies able co-operation in business, as if the successful merchant prince were looking from his side towards yours with a view to help you.",
      reversed:
        "The end of troubles, suspension or cessation of adversity, toil and disappointment.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa03.htm",
    },
  },
  {
    id: "wands-04",
    arcana: "minor",
    suit: "wands",
    number: 4,
    nameEn: "Four of Wands",
    nameKo: "완드 4",
    upright: {
      keywords: ["축하", "안식처", "화합", "안정", "결실"],
      meaning:
        "노력이 한 단계 결실을 맺어 축하하고 쉬어 갈 수 있는 때예요. 집이나 공동체 안에서 편안함과 화합을 느끼기 쉬워요. 함께한 사람들과 기쁨을 나누며 다음을 위한 힘을 모아 보세요.",
    },
    reversed: {
      keywords: ["소소한 기쁨", "과도기", "어수선함", "여전한 번영"],
      meaning:
        "기쁨과 번영의 기운은 여전하지만, 형식이나 분위기가 기대와 조금 다를 수 있어요. 변화의 과도기라 주변이 어수선하게 느껴지기도 해요. 거창한 축하보다 소소한 즐거움을 챙기면 안정감이 돌아와요.",
    },
    waite: {
      upright:
        "They are for once almost on the surface--country life, haven of refuge, a species of domestic harvest-home, repose, concord, harmony, prosperity, peace, and the perfected work of these.",
      reversed:
        "The meaning remains unaltered; it is prosperity, increase, felicity, beauty, embellishment.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa04.htm",
    },
  },
  {
    id: "wands-05",
    arcana: "minor",
    suit: "wands",
    number: 5,
    nameEn: "Five of Wands",
    nameKo: "완드 5",
    upright: {
      keywords: ["경쟁", "의견 충돌", "도전", "치열함"],
      meaning:
        "서로 다른 의견과 에너지가 부딪히며 경쟁이 치열해지는 때예요. 진짜 싸움이라기보다 실력을 겨루는 과정에 가까워 그 안에서 성장할 수 있어요. 승패보다 규칙을 지키며 건강하게 겨루는 데 집중해 보세요.",
    },
    reversed: {
      keywords: ["분쟁", "갈등 회피", "꼼수", "모순"],
      meaning:
        "경쟁이 감정싸움으로 번지거나 공정하지 않은 방식이 끼어들 수 있어요. 갈등을 피하려고만 하면 문제가 더 오래 남기도 해요. 서로의 입장을 정리해 합의점을 찾는 데 힘을 써 보세요.",
    },
    waite: {
      upright:
        "Imitation, as, for example, sham fight, but also the strenuous competition and struggle of the search after riches and fortune. In this sense it connects with the battle of life. Hence some attributions say that it is a card of gold, gain, opulence.",
      reversed:
        "Litigation, disputes, trickery, contradiction.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa05.htm",
    },
  },
  {
    id: "wands-06",
    arcana: "minor",
    suit: "wands",
    number: 6,
    nameEn: "Six of Wands",
    nameKo: "완드 6",
    upright: {
      keywords: ["승리", "인정", "좋은 소식", "자신감", "성취"],
      meaning:
        "노력이 결실을 맺어 주변의 인정과 박수를 받는 때예요. 기다리던 좋은 소식이 들려오고 자신감도 한층 높아져요. 성취를 기쁘게 누리되 함께해 준 사람들에게도 고마움을 전해 보세요.",
    },
    reversed: {
      keywords: ["지연", "불안", "인정받지 못함", "신뢰 문제"],
      meaning:
        "기대했던 성과나 인정이 늦어지면서 마음이 조급해질 수 있어요. 가까운 관계에서 신뢰가 흔들리는 일이 생기기도 하니 소통을 분명히 해 두세요. 남의 평가보다 스스로 이룬 과정을 인정해 주는 것이 중요해요.",
    },
    waite: {
      upright:
        "The card has been so designed that it can cover several significations; on the surface, it is a victor triumphing, but it is also great news, such as might be carried in state by the King's courier; it is expectation crowned with its own desire, the crown of hope, and so forth.",
      reversed:
        "Apprehension, fear, as of a victorious enemy at the gate; treachery, disloyalty, as of gates being opened to the enemy; also indefinite delay.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa06.htm",
    },
  },
  {
    id: "wands-07",
    arcana: "minor",
    suit: "wands",
    number: 7,
    nameEn: "Seven of Wands",
    nameKo: "완드 7",
    upright: {
      keywords: ["방어", "용기", "유리한 위치", "버팀", "신념"],
      meaning:
        "여러 도전과 압박이 있지만 유리한 자리에서 당당히 맞설 수 있는 때예요. 내 입장과 신념을 분명히 지키면 결국 원하는 결과를 얻어요. 물러서지 말고 차분하게 논리를 펼쳐 보세요.",
    },
    reversed: {
      keywords: ["압박감", "당혹", "우유부단", "지침"],
      meaning:
        "사방에서 밀려오는 요구에 지치거나 무엇을 지켜야 할지 혼란스러울 수 있어요. 망설임이 길어지면 상황이 더 불리해지기 쉬워요. 꼭 지켜야 할 것과 내려놓아도 될 것을 구분해 보세요.",
    },
    waite: {
      upright:
        "It is a card of valour, for, on the surface, six are attacking one, who has, however, the vantage position. On the intellectual plane, it signifies discussion, wordy strife; in business--negotiations, war of trade, barter, competition. It is further a card of success, for the combatant is on the top and his enemies may be unable to reach him.",
      reversed:
        "Perplexity, embarrassments, anxiety. It is also a caution against indecision.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa07.htm",
    },
  },
  {
    id: "wands-08",
    arcana: "minor",
    suit: "wands",
    number: 8,
    nameEn: "Eight of Wands",
    nameKo: "완드 8",
    upright: {
      keywords: ["신속함", "진전", "소식", "움직임", "설렘"],
      meaning:
        "멈춰 있던 일이 빠르게 움직이며 속도가 붙는 때예요. 연락이나 소식이 잇따라 들어오고, 마음이 설레는 일도 생길 수 있어요. 흐름을 놓치지 않도록 바로 응답하고 실행해 보세요.",
    },
    reversed: {
      keywords: ["지연", "엇갈린 소통", "질투", "조급함"],
      meaning:
        "서두를수록 일이 꼬이거나 연락이 엇갈려 답답함을 느낄 수 있어요. 가까운 관계에서 질투나 사소한 다툼이 생기기 쉬우니 말을 한 번 더 고르세요. 속도를 잠시 늦추고 순서를 다시 정리해 보세요.",
    },
    waite: {
      upright:
        "Activity in undertakings, the path of such activity, swiftness, as that of an express messenger; great haste, great hope, speed towards an end which promises assured felicity; generally, that which is on the move; also the arrows of love.",
      reversed:
        "Arrows of jealousy, internal dispute, stingings of conscience, quarrels; and domestic disputes for persons who are married.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa08.htm",
    },
  },
  {
    id: "wands-09",
    arcana: "minor",
    suit: "wands",
    number: 9,
    nameEn: "Nine of Wands",
    nameKo: "완드 9",
    upright: {
      keywords: ["끈기", "경계", "회복력", "방어", "마지막 고비"],
      meaning:
        "여러 번의 고비를 지나 지쳤지만 아직 버틸 힘이 남아 있는 때예요. 경계를 늦추지 않고 내 자리를 지키면 끝까지 해낼 수 있어요. 잠시 일이 멈추는 듯해도 마지막 고비라 생각하고 힘을 아껴 쓰세요.",
    },
    reversed: {
      keywords: ["소진", "방어적 태도", "장애물", "의심"],
      meaning:
        "계속된 긴장으로 지쳐 사소한 일에도 방어적으로 반응할 수 있어요. 앞을 가로막는 장애물이 크게 느껴지는 때이니 혼자 모든 것을 짊어지지 마세요. 도움을 요청하고 쉬어 가는 것도 용기예요.",
    },
    waite: {
      upright:
        "The card signifies strength in opposition. If attacked, the person will meet an onslaught boldly; and his build shews, that he may prove a formidable antagonist. With this main significance there are all its possible adjuncts--delay, suspension, adjournment.",
      reversed:
        "Obstacles, adversity, calamity.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa09.htm",
    },
  },
  {
    id: "wands-10",
    arcana: "minor",
    suit: "wands",
    number: 10,
    nameEn: "Ten of Wands",
    nameKo: "완드 10",
    upright: {
      keywords: ["부담", "과도한 책임", "노력", "압박", "완수 직전"],
      meaning:
        "맡은 일이 많아 어깨가 무겁지만 목표 지점이 멀지 않은 때예요. 성공을 이루었더라도 그것을 지키는 일이 짐처럼 느껴질 수 있어요. 모두 혼자 들기보다 나눌 수 있는 일은 나누어 보세요.",
    },
    reversed: {
      keywords: ["소진", "얽힌 문제", "짐 내려놓기", "책임 분산"],
      meaning:
        "감당하기 어려운 짐 때문에 지치거나 여러 문제가 얽혀 풀리지 않을 수 있어요. 무엇이 꼭 내 몫인지 다시 따져 보면 내려놓을 것이 보여요. 우선순위를 정리하면 한결 가벼워질 수 있어요.",
    },
    waite: {
      upright:
        "A card of many significances, and some of the readings cannot be harmonized. I set aside that which connects it with honour and good faith. The chief meaning is oppression simply, but it is also fortune, gain, any kind of success, and then it is the oppression of these things. It is also a card of false-seeming, disguise, perfidy. The place which the figure is approaching may suffer from the rods that he carries. Success is stultified if the Nine of Swords follows, and if it is a question of a lawsuit, there will be certain loss.",
      reversed:
        "Contrarieties, difficulties, intrigues, and their analogies.",
      source: "https://sacred-texts.com/tarot/pkt/pktwa10.htm",
    },
  },
  {
    id: "wands-11",
    arcana: "minor",
    suit: "wands",
    number: 11,
    nameEn: "Page of Wands",
    nameKo: "완드 페이지",
    upright: {
      keywords: ["호기심", "열정", "새로운 소식", "탐험", "충실함"],
      meaning:
        "새로운 것에 대한 호기심과 순수한 열정이 샘솟는 때예요. 반가운 소식이나 흥미로운 제안이 찾아올 수 있어요. 완벽하게 준비되지 않았더라도 배우는 마음으로 먼저 시도해 보세요.",
    },
    reversed: {
      keywords: ["변덕", "미숙함", "나쁜 소식", "우유부단"],
      meaning:
        "열정이 쉽게 타올랐다 금세 식으면서 시작한 일을 끝맺지 못할 수 있어요. 기대와 다른 소식에 실망하기도 하지만 너무 확대해석하지는 마세요. 하나를 정해 꾸준히 이어 가는 연습이 필요해요.",
    },
    waite: {
      upright:
        "Dark young man, faithful, a lover, an envoy, a postman. Beside a man, he will bear favourable testimony concerning him. A dangerous rival, if followed by the Page of Cups. Has the chief qualities of his suit. He may signify family intelligence.",
      reversed:
        "Anecdotes, announcements, evil news. Also indecision and the instability which accompanies it.",
      source: "https://sacred-texts.com/tarot/pkt/pktwapa.htm",
    },
  },
  {
    id: "wands-12",
    arcana: "minor",
    suit: "wands",
    number: 12,
    nameEn: "Knight of Wands",
    nameKo: "완드 나이트",
    upright: {
      keywords: ["모험", "추진력", "이동", "열정", "대담함"],
      meaning:
        "열정을 따라 거침없이 움직이는 에너지가 강한 때예요. 이사나 여행, 새로운 환경으로의 이동이 생길 수 있어요. 대담하게 나아가되 출발 전에 방향만은 확인해 두세요.",
    },
    reversed: {
      keywords: ["성급함", "중단", "충돌", "산만함"],
      meaning:
        "충동적으로 움직이다 일이 중간에 끊기거나 주변과 부딪힐 수 있어요. 에너지가 여러 방향으로 흩어져 끝맺음이 약해지기 쉬워요. 속도보다 지속력을 생각하며 한 가지에 집중해 보세요.",
    },
    waite: {
      upright:
        "Departure, absence, flight, emigration. A dark young man, friendly. Change of residence.",
      reversed:
        "Rupture, division, interruption, discord.",
      source: "https://sacred-texts.com/tarot/pkt/pktwakn.htm",
    },
  },
  {
    id: "wands-13",
    arcana: "minor",
    suit: "wands",
    number: 13,
    nameEn: "Queen of Wands",
    nameKo: "완드 퀸",
    upright: {
      keywords: ["자신감", "따뜻함", "독립성", "매력", "활력"],
      meaning:
        "자신감과 따뜻한 카리스마로 주변을 밝히는 때예요. 사람들에게 호의적으로 다가가면서도 자기 일을 당당하게 꾸려 가요. 하는 일에서도 좋은 성과를 기대할 수 있으니 적극적으로 나서 보세요.",
    },
    reversed: {
      keywords: ["질투", "자기 의심", "예민함", "과한 통제"],
      meaning:
        "평소의 자신감이 흔들려 남과 비교하거나 질투를 느끼기 쉬운 때예요. 예민해진 마음이 말투로 드러나 오해를 살 수도 있어요. 실속 있고 성실한 본래의 장점을 떠올리며 마음의 여유를 되찾아 보세요.",
    },
    waite: {
      upright:
        "A dark woman, countrywoman, friendly, chaste, loving, honourable. If the card beside her signifies a man, she is well disposed towards him; if a woman, she is interested in the Querent. Also, love of money, or a certain success in business.",
      reversed:
        "Good, economical, obliging, serviceable. Signifies also--but in certain positions and in the neighbourhood of other cards tending in such directions--opposition, jealousy, even deceit and infidelity.",
      source: "https://sacred-texts.com/tarot/pkt/pktwaqu.htm",
    },
  },
  {
    id: "wands-14",
    arcana: "minor",
    suit: "wands",
    number: 14,
    nameEn: "King of Wands",
    nameKo: "완드 킹",
    upright: {
      keywords: ["리더십", "비전", "정직함", "결단력", "책임감"],
      meaning:
        "뚜렷한 비전과 결단력으로 사람들을 이끄는 리더의 기운이에요. 정직하고 성실한 태도가 신뢰를 얻고, 큰 그림을 현실로 만들어 가요. 뜻밖의 기회나 반가운 소식이 찾아올 수도 있어요.",
    },
    reversed: {
      keywords: ["독단", "엄격함", "조급함", "높은 기대"],
      meaning:
        "추진력이 지나쳐 독단적으로 보이거나 주변에 너무 엄격한 기준을 들이댈 수 있어요. 의도는 좋아도 표현이 딱딱하면 사람들이 거리를 느끼기 쉬워요. 단호함에 너그러움을 조금 더해 보세요.",
    },
    waite: {
      upright:
        "Dark man, friendly, countryman, generally married, honest and conscientious. The card always signifies honesty, and may mean news concerning an unexpected heritage to fall in before very long.",
      reversed:
        "Good, but severe; austere, yet tolerant.",
      source: "https://sacred-texts.com/tarot/pkt/pktwaki.htm",
    },
  },
  {
    id: "cups-01",
    arcana: "minor",
    suit: "cups",
    number: 1,
    nameEn: "Ace of Cups",
    nameKo: "컵 에이스",
    upright: {
      keywords: ["새로운 감정", "사랑", "충만함", "기쁨", "공감"],
      meaning:
        "마음이 가득 차오르며 새로운 사랑이나 따뜻한 감정이 시작되는 때예요. 기쁨과 만족감이 넘쳐 주변에도 너그러워져요. 마음을 열고 받은 사랑을 자연스럽게 나눠 보세요.",
    },
    reversed: {
      keywords: ["감정 차단", "공허함", "불안정", "변화"],
      meaning:
        "감정을 억누르거나 마음이 쉽게 흔들려 진심을 확인하기 어려울 수 있어요. 겉으로는 괜찮아 보여도 속으로 공허함을 느끼기도 해요. 나에게 먼저 다정해지는 연습이 마음을 다시 채워 줘요.",
    },
    waite: {
      upright:
        "House of the true heart, joy, content, abode, nourishment, abundance, fertility; Holy Table, felicity hereof.",
      reversed:
        "House of the false heart, mutation, instability, revolution.",
      source: "https://sacred-texts.com/tarot/pkt/pktcuac.htm",
    },
  },
  {
    id: "cups-02",
    arcana: "minor",
    suit: "cups",
    number: 2,
    nameEn: "Two of Cups",
    nameKo: "컵 2",
    upright: {
      keywords: ["연결", "사랑", "동반자", "화합", "공감"],
      meaning:
        "서로 마음이 통하는 사람과 깊이 연결되는 때예요. 연인뿐 아니라 친구나 동료와도 대등하고 따뜻한 관계를 맺기 좋아요. 진심을 솔직하게 표현하면 관계가 한층 깊어져요.",
    },
    reversed: {
      keywords: ["엇갈림", "불균형", "소통 단절", "거리감"],
      meaning:
        "서로의 마음이 엇갈리거나 관계의 균형이 한쪽으로 기울 수 있어요. 작은 오해가 쌓여 거리감이 생기기 쉬운 때예요. 상대의 입장을 들어 보고 내 마음도 차분히 전해 보세요.",
    },
    waite: {
      upright:
        "Love, passion, friendship, affinity, union, concord, sympathy, the interrelation of the sexes, and--as a suggestion apart from all offices of divination--that desire which is not in Nature, but by which Nature is sanctified.",
      // 웨이트 원전(출처 페이지)에 이 카드의 역방향 의미가 없음
      reversed: "Passion.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu02.htm",
    },
  },
  {
    id: "cups-03",
    arcana: "minor",
    suit: "cups",
    number: 3,
    nameEn: "Three of Cups",
    nameKo: "컵 3",
    upright: {
      keywords: ["축하", "우정", "기쁨", "모임", "풍요"],
      meaning:
        "좋은 사람들과 함께 기쁨을 나누고 축하할 일이 생기는 때예요. 일이 원만하게 마무리되어 마음이 한결 가벼워져요. 함께해 준 이들과 즐거움을 나누면 그 기쁨이 더 커져요.",
    },
    reversed: {
      keywords: ["과잉", "방종", "빠른 마무리", "관계 피로"],
      meaning:
        "즐거움이 지나쳐 절제를 잃거나, 어울림이 오히려 피로하게 느껴질 수 있어요. 일이 서둘러 마무리되면서 아쉬움이 남기도 해요. 즐기는 만큼 나만의 리듬과 경계도 지켜 보세요.",
    },
    waite: {
      upright:
        "The conclusion of any matter in plenty, perfection and merriment; happy issue, victory, fulfilment, solace, healing,",
      reversed:
        "Expedition, dispatch, achievement, end. It signifies also the side of excess in physical enjoyment, and the pleasures of the senses.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu03.htm",
    },
  },
  {
    id: "cups-04",
    arcana: "minor",
    suit: "cups",
    number: 4,
    nameEn: "Four of Cups",
    nameKo: "컵 4",
    upright: {
      keywords: ["권태", "무관심", "내면 성찰", "놓친 기회", "불만족"],
      meaning:
        "익숙한 것들에 흥미를 잃고 마음이 시큰둥해지는 때예요. 지금 가진 것에 만족하지 못하다 보면 눈앞의 새로운 제안을 놓치기 쉬워요. 잠시 마음을 들여다보되 주변에서 내미는 손길에도 눈을 돌려 보세요.",
    },
    reversed: {
      keywords: ["새로운 관심", "재도약", "새로운 인연", "깨달음"],
      meaning:
        "무기력에서 벗어나 다시 새로운 것에 마음이 움직이기 시작해요. 새로운 배움이나 인연이 활력을 불어넣어 줄 수 있어요. 다가오는 기회에 가볍게 응답해 보세요.",
    },
    waite: {
      upright:
        "Weariness, disgust, aversion, imaginary vexations, as if the wine of this world had caused satiety only; another wine, as if a fairy gift, is now offered the wastrel, but he sees no consolation therein. This is also a card of blended pleasure.",
      reversed:
        "Novelty, presage, new instruction, new relations.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu04.htm",
    },
  },
  {
    id: "cups-05",
    arcana: "minor",
    suit: "cups",
    number: 5,
    nameEn: "Five of Cups",
    nameKo: "컵 5",
    upright: {
      keywords: ["상실", "후회", "실망", "슬픔", "남은 것"],
      meaning:
        "잃어버린 것에 마음이 쏠려 아쉬움과 실망이 큰 때예요. 하지만 모든 것을 잃은 것은 아니며, 아직 곁에 남아 있는 소중한 것이 있어요. 충분히 슬퍼한 뒤 남은 것으로 다시 시작할 힘을 모아 보세요.",
    },
    reversed: {
      keywords: ["회복", "수용", "재회", "다시 일어섬"],
      meaning:
        "슬픔을 받아들이고 조금씩 앞으로 나아갈 힘이 생기는 때예요. 반가운 소식이나 오랜 인연과 다시 이어질 수도 있어요. 다만 지나치게 서두른 계획은 한 번 더 점검해 보세요.",
    },
    waite: {
      upright:
        "It is a card of loss, but something remains over; three have been taken, but two are left; it is a card of inheritance, patrimony, transmission, but not corresponding to expectations; with some interpreters it is a card of marriage, but not without bitterness or frustration.",
      reversed:
        "News, alliances, affinity, consanguinity, ancestry, return, false projects.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu05.htm",
    },
  },
  {
    id: "cups-06",
    arcana: "minor",
    suit: "cups",
    number: 6,
    nameEn: "Six of Cups",
    nameKo: "컵 6",
    upright: {
      keywords: ["추억", "향수", "순수함", "과거의 인연", "따뜻함"],
      meaning:
        "지난 시간의 따뜻한 기억이 떠오르며 마음이 순수해지는 때예요. 오랜 친구나 과거의 인연과 다시 연결될 수 있어요. 추억에서 위로를 얻되, 그 기운을 지금의 삶에 살려 보세요.",
    },
    reversed: {
      keywords: ["미래 지향", "과거 집착", "새 출발", "성장"],
      meaning:
        "과거에 머물던 시선을 앞으로 돌려야 할 때예요. 지나간 일을 미화하거나 붙잡고 있으면 새로운 기회를 놓치기 쉬워요. 곧 다가올 변화를 기대하며 한 걸음 내디뎌 보세요.",
    },
    waite: {
      upright:
        "A card of the past and of memories, looking back, as--for example--on childhood; happiness, enjoyment, but coming rather from the past; things that have vanished. Another reading reverses this, giving new relations, new knowledge, new environment, and then the children are disporting in an unfamiliar precinct.",
      reversed:
        "The future, renewal, that which will come to pass presently.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu06.htm",
    },
  },
  {
    id: "cups-07",
    arcana: "minor",
    suit: "cups",
    number: 7,
    nameEn: "Seven of Cups",
    nameKo: "컵 7",
    upright: {
      keywords: ["상상", "많은 선택지", "환상", "공상", "유혹"],
      meaning:
        "여러 가능성과 꿈이 한꺼번에 눈앞에 펼쳐져 마음이 설레는 때예요. 그러나 모두 실현 가능한 것은 아니니 환상과 현실을 구분할 필요가 있어요. 정말 원하는 것 하나를 골라 구체적으로 그려 보세요.",
    },
    reversed: {
      keywords: ["결단", "명확함", "의지", "현실 직시"],
      meaning:
        "막연한 공상에서 벗어나 원하는 것을 분명히 정하는 때예요. 의지가 생기면서 계획을 실행으로 옮길 힘도 커져요. 선택한 목표에 집중하면 길이 또렷해져요.",
    },
    waite: {
      upright:
        "Fairy favours, images of reflection, sentiment, imagination, things seen in the glass of contemplation; some attainment in these degrees, but nothing permanent or substantial is suggested.",
      reversed:
        "Desire, will, determination, project.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu07.htm",
    },
  },
  {
    id: "cups-08",
    arcana: "minor",
    suit: "cups",
    number: 8,
    nameEn: "Eight of Cups",
    nameKo: "컵 8",
    upright: {
      keywords: ["떠남", "내려놓음", "새로운 탐색", "전환", "실망"],
      meaning:
        "한때 중요했던 것이 더는 마음을 채우지 못해 떠날 준비를 하는 때예요. 생각보다 그 일이 크지 않았다는 것을 깨닫게 되기도 해요. 아쉬움이 있더라도 더 의미 있는 것을 찾아 나서는 용기를 내 보세요.",
    },
    reversed: {
      keywords: ["기쁨", "다시 찾은 의미", "망설임", "머무름"],
      meaning:
        "떠날까 고민하던 자리에서 오히려 기쁨과 만족을 다시 발견할 수 있어요. 다만 변화가 두려워 머무르는 것이라면 마음을 솔직하게 점검해 보세요. 지금 내게 진짜 의미 있는 것이 무엇인지가 답이 돼요.",
    },
    waite: {
      upright:
        "The card speaks for itself on the surface, but other readings are entirely antithetical--giving joy, mildness, timidity, honour, modesty. In practice, it is usually found that the card shews the decline of a matter, or that a matter which has been thought to be important is really of slight consequence--either for good or evil.",
      reversed:
        "Great joy, happiness, feasting.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu08.htm",
    },
  },
  {
    id: "cups-09",
    arcana: "minor",
    suit: "cups",
    number: 9,
    nameEn: "Nine of Cups",
    nameKo: "컵 9",
    upright: {
      keywords: ["만족", "소원 성취", "즐거움", "여유", "풍족함"],
      meaning:
        "바라던 일이 이루어져 마음 깊이 만족을 느끼는 때예요. 몸과 마음이 편안하고 여유로워 즐거움을 누리기 좋아요. 이룬 것에 감사하며 기쁨을 충분히 맛보세요.",
    },
    reversed: {
      keywords: ["진실", "자유", "작은 흠", "과한 기대"],
      meaning:
        "겉으로 보이는 만족 너머의 진짜 마음을 마주하게 되는 때예요. 기대가 너무 크면 작은 흠에도 실망하기 쉬우니 완벽함을 내려놓아 보세요. 솔직하고 자유로운 선택이 더 깊은 만족으로 이어져요.",
    },
    waite: {
      upright:
        "Concord, contentment, physical bien-être; also victory, success, advantage; satisfaction for the Querent or person for whom the consultation is made.",
      reversed:
        "Truth, loyalty, liberty; but the readings vary and include mistakes, imperfections, etc.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu09.htm",
    },
  },
  {
    id: "cups-10",
    arcana: "minor",
    suit: "cups",
    number: 10,
    nameEn: "Ten of Cups",
    nameKo: "컵 10",
    upright: {
      keywords: ["행복", "가족", "화목", "정서적 충만", "평화"],
      meaning:
        "마음 깊이 평화와 행복을 느끼는 충만한 흐름이에요. 가족이나 소중한 사람들과의 관계가 따뜻하고 단단해져요. 함께하는 일상의 소중함을 표현하며 그 기쁨을 오래 간직해 보세요.",
    },
    reversed: {
      keywords: ["불화", "서운함", "겉도는 평화", "기대 어긋남"],
      meaning:
        "겉으로는 평온해 보여도 마음속에 서운함이나 불만이 쌓여 있을 수 있어요. 기대했던 모습과 현실이 달라 실망하기도 해요. 감정을 쌓아 두기보다 차분히 대화로 풀어 보세요.",
    },
    waite: {
      upright:
        "Contentment, repose of the entire heart; the perfection of that state; also perfection of human love and friendship; if with several picture-cards, a person who is taking charge of the Querent's interests; also the town, village or country inhabited by the Querent.",
      reversed:
        "Repose of the false heart, indignation, violence.",
      source: "https://sacred-texts.com/tarot/pkt/pktcu10.htm",
    },
  },
  {
    id: "cups-11",
    arcana: "minor",
    suit: "cups",
    number: 11,
    nameEn: "Page of Cups",
    nameKo: "컵 페이지",
    upright: {
      keywords: ["감수성", "새로운 감정", "소식", "상상력", "배움"],
      meaning:
        "섬세한 감수성과 상상력이 살아나는 때예요. 마음을 설레게 하는 소식이나 제안이 찾아올 수 있어요. 떠오르는 감정과 아이디어를 기록하며 차분히 배워 가 보세요.",
    },
    reversed: {
      keywords: ["감정 기복", "미숙함", "현혹", "유혹"],
      meaning:
        "감정에 쉽게 휩쓸리거나 달콤한 말에 마음이 기울 수 있어요. 끌림이 강할수록 상대의 진심을 차분히 살펴볼 필요가 있어요. 내 감정을 솔직하게 들여다보는 시간이 도움이 돼요.",
    },
    waite: {
      upright:
        "Fair young man, one impelled to render service and with whom the Querent will be connected; a studious youth; news, message; application, reflection, meditation; also these things directed to business.",
      reversed:
        "Taste, inclination, attachment, seduction, deception, artifice.",
      source: "https://sacred-texts.com/tarot/pkt/pktcupa.htm",
    },
  },
  {
    id: "cups-12",
    arcana: "minor",
    suit: "cups",
    number: 12,
    nameEn: "Knight of Cups",
    nameKo: "컵 나이트",
    upright: {
      keywords: ["제안", "낭만", "초대", "다가옴", "진심"],
      meaning:
        "마음을 담은 제안이나 초대가 다가오는 때예요. 낭만적이고 부드러운 태도가 사람들의 마음을 움직여요. 감정에 충실하되 실천으로 진심을 보여 주세요.",
    },
    reversed: {
      keywords: ["과장", "속임수", "변덕", "비현실적 기대"],
      meaning:
        "그럴듯한 말이나 제안 뒤에 과장이나 숨은 의도가 있을 수 있어요. 기분에 따라 마음이 쉽게 바뀌어 약속을 지키기 어려워지기도 해요. 달콤함보다 행동의 일관성을 기준으로 판단해 보세요.",
    },
    waite: {
      upright:
        "Arrival, approach--sometimes that of a messenger; advances, proposition, demeanour, invitation, incitement.",
      reversed:
        "Trickery, artifice, subtlety, swindling, duplicity, fraud.",
      source: "https://sacred-texts.com/tarot/pkt/pktcukn.htm",
    },
  },
  {
    id: "cups-13",
    arcana: "minor",
    suit: "cups",
    number: 13,
    nameEn: "Queen of Cups",
    nameKo: "컵 퀸",
    upright: {
      keywords: ["공감", "직관", "다정함", "헌신", "포용"],
      meaning:
        "다정하고 깊은 공감으로 사람들의 마음을 품어 주는 때예요. 예민한 직관이 상황의 본질을 꿰뚫어 보도록 도와줘요. 남을 돌보는 만큼 내 마음도 따뜻하게 돌봐 주세요.",
    },
    reversed: {
      keywords: ["감정 과잉", "의존", "신뢰 문제", "경계 부족"],
      meaning:
        "남의 감정을 지나치게 떠안아 지치거나 감정에 휘둘려 판단이 흐려질 수 있어요. 겉모습만 보고 쉽게 믿기보다 시간을 두고 살펴보세요. 건강한 경계를 세우는 것이 서로를 위한 배려예요.",
    },
    waite: {
      upright:
        "Good, fair woman; honest, devoted woman, who will do service to the Querent; loving intelligence, and hence the gift of vision; success, happiness, pleasure; also wisdom, virtue; a perfect spouse and a good mother.",
      reversed:
        "The accounts vary; good woman; otherwise, distinguished woman but one not to be trusted; perverse woman; vice, dishonour, depravity.",
      source: "https://sacred-texts.com/tarot/pkt/pktcuqu.htm",
    },
  },
  {
    id: "cups-14",
    arcana: "minor",
    suit: "cups",
    number: 14,
    nameEn: "King of Cups",
    nameKo: "컵 킹",
    upright: {
      keywords: ["정서적 안정", "관대함", "책임감", "창의적 지혜"],
      meaning:
        "감정에 휘둘리지 않고 차분하게 상황을 다스리는 성숙함이 돋보이는 때예요. 너그럽고 책임감 있는 태도로 주변을 돕고 신뢰를 얻어요. 이성과 감성의 균형을 살려 결정을 내려 보세요.",
    },
    reversed: {
      keywords: ["감정 조종", "이중성", "불공정", "냉담함"],
      meaning:
        "감정을 숨기거나 앞뒤가 다른 태도로 신뢰를 잃을 수 있어요. 겉과 속이 다른 사람이나 공정하지 않은 제안은 경계하는 것이 좋아요. 내 감정을 솔직하게 인정할 때 다시 중심을 잡을 수 있어요.",
    },
    waite: {
      upright:
        "Fair man, man of business, law, or divinity; responsible, disposed to oblige the Querent; also equity, art and science, including those who profess science, law and art; creative intelligence.",
      reversed:
        "Dishonest, double-dealing man; roguery, exaction, injustice, vice, scandal, pillage, considerable loss.",
      source: "https://sacred-texts.com/tarot/pkt/pktcuki.htm",
    },
  },
  {
    id: "swords-01",
    arcana: "minor",
    suit: "swords",
    number: 1,
    nameEn: "Ace of Swords",
    nameKo: "소드 에이스",
    upright: {
      keywords: ["명료함", "돌파", "진실", "결단", "강한 의지"],
      meaning:
        "흐릿했던 생각이 한순간 명료해지며 돌파구가 열리는 때예요. 강한 의지와 명확한 판단으로 상황을 이끌어 갈 수 있어요. 진실을 기준으로 단호하게 결정해 보세요.",
    },
    reversed: {
      keywords: ["혼란", "지나친 힘", "판단 착오", "공격성"],
      meaning:
        "힘을 과하게 쓰다 오히려 일을 그르치거나 말이 날카로워져 상처를 줄 수 있어요. 생각이 정리되지 않은 채 결정을 내리면 결과가 기대와 다를 수 있어요. 한 번 더 숙고한 뒤 부드럽게 표현해 보세요.",
    },
    waite: {
      upright:
        "Triumph, the excessive degree in everything, conquest, triumph of force. It is a card of great force, in love as well as in hatred. The crown may carry a much higher significance than comes usually within the sphere of fortune-telling.",
      reversed:
        "The same, but the results are disastrous; another account says--conception, childbirth, augmentation, multiplicity.",
      source: "https://sacred-texts.com/tarot/pkt/pktswac.htm",
    },
  },
  {
    id: "swords-02",
    arcana: "minor",
    suit: "swords",
    number: 2,
    nameEn: "Two of Swords",
    nameKo: "소드 2",
    upright: {
      keywords: ["교착", "균형", "선택 보류", "휴전", "신중함"],
      meaning:
        "두 갈래 길 앞에서 쉽게 결정을 내리지 못하고 균형을 지키고 있는 때예요. 당장은 평온해 보여도 마음을 닫아 둔 채 버티는 상태일 수 있어요. 필요한 정보를 모은 뒤 마음의 눈을 뜨고 선택해 보세요.",
    },
    reversed: {
      keywords: ["거짓", "불신", "흔들리는 균형", "결정 압박"],
      meaning:
        "애써 지키던 균형이 흔들리며 미뤄 둔 결정을 해야 하는 상황이 올 수 있어요. 들리는 말 중 사실이 아닌 것이 섞여 있을 수 있으니 출처를 확인해 보세요. 솔직함이 오히려 문제를 푸는 열쇠가 돼요.",
    },
    waite: {
      upright:
        "Conformity and the equipoise which it suggests, courage, friendship, concord in a state of arms; another reading gives tenderness, affection, intimacy. The suggestion of harmony and other favourable readings must be considered in a qualified manner, as Swords generally are not symbolical of beneficent forces in human affairs.",
      reversed:
        "Imposture, falsehood, duplicity, disloyalty.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw02.htm",
    },
  },
  {
    id: "swords-03",
    arcana: "minor",
    suit: "swords",
    number: 3,
    nameEn: "Three of Swords",
    nameKo: "소드 3",
    upright: {
      keywords: ["상심", "이별", "슬픔", "아픈 진실", "분리"],
      meaning:
        "마음이 아픈 소식이나 이별로 슬픔을 겪을 수 있는 때예요. 고통스럽지만 진실을 마주하는 과정이 회복의 출발점이 되기도 해요. 감정을 억누르지 말고 충분히 표현하며 스스로를 위로해 주세요.",
    },
    reversed: {
      keywords: ["회복 과정", "혼란", "미련", "마음 정리"],
      meaning:
        "상처가 아물어 가지만 마음이 아직 어지럽고 생각이 정리되지 않을 수 있어요. 지난 일을 곱씹을수록 혼란이 커지기 쉬워요. 천천히 마음을 정리하며 나를 다독이는 시간을 가져 보세요.",
    },
    waite: {
      upright:
        "Removal, absence, delay, division, rupture, dispersion, and all that the design signifies naturally, being too simple and obvious to call for specific enumeration.",
      reversed:
        "Mental alienation, error, loss, distraction, disorder, confusion.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw03.htm",
    },
  },
  {
    id: "swords-04",
    arcana: "minor",
    suit: "swords",
    number: 4,
    nameEn: "Four of Swords",
    nameKo: "소드 4",
    upright: {
      keywords: ["휴식", "재충전", "고요함", "물러남", "회복"],
      meaning:
        "치열했던 시간을 지나 잠시 물러나 쉬어 가야 할 때예요. 고요한 곳에서 생각을 정리하면 다음 걸음을 위한 힘이 차올라요. 쉼도 계획의 일부라고 여기고 스스로에게 시간을 허락해 주세요.",
    },
    reversed: {
      keywords: ["활동 재개", "신중한 관리", "조심성", "준비"],
      meaning:
        "충분히 쉬었다면 이제 다시 움직일 준비를 하는 때예요. 서두르기보다 시간과 에너지를 신중하게 관리하며 단계적으로 시작해 보세요. 다만 지나치게 아끼고 망설이면 기회를 놓칠 수 있어요.",
    },
    waite: {
      upright:
        "Vigilance, retreat, solitude, hermit's repose, exile, tomb and coffin. It is these last that have suggested the design.",
      reversed:
        "Wise administration, circumspection, economy, avarice, precaution, testament.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw04.htm",
    },
  },
  {
    id: "swords-05",
    arcana: "minor",
    suit: "swords",
    number: 5,
    nameEn: "Five of Swords",
    nameKo: "소드 5",
    upright: {
      keywords: ["갈등", "패배감", "상처뿐인 승리", "불명예", "손실"],
      meaning:
        "이기는 데만 집중하다 관계에 상처를 남길 수 있는 때예요. 승패가 갈려도 모두가 무언가를 잃는 다툼일 수 있어요. 지금 이 싸움이 정말 필요한지 한 걸음 물러서서 생각해 보세요.",
    },
    reversed: {
      keywords: ["화해", "후회", "매듭짓기", "남은 앙금"],
      meaning:
        "다툼이 지나간 뒤 남은 앙금과 아쉬움을 정리해야 하는 때예요. 지난 갈등을 끝내고 매듭짓는 과정이 필요해요. 먼저 사과하거나 손을 내미는 것이 관계를 되살리는 계기가 될 수 있어요.",
    },
    waite: {
      upright:
        "Degradation, destruction, revocation, infamy, dishonour, loss, with the variants and analogues of these.",
      reversed:
        "The same; burial and obsequies.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw05.htm",
    },
  },
  {
    id: "swords-06",
    arcana: "minor",
    suit: "swords",
    number: 6,
    nameEn: "Six of Swords",
    nameKo: "소드 6",
    upright: {
      keywords: ["이동", "전환", "회복의 여정", "떠남", "안정 찾기"],
      meaning:
        "힘든 상황을 뒤로하고 더 잔잔한 곳으로 옮겨 가는 때예요. 여행이나 이동, 환경의 변화가 마음을 안정시키는 데 도움이 돼요. 무거운 짐은 내려놓고 앞으로의 방향에 집중해 보세요.",
    },
    reversed: {
      keywords: ["고백", "드러남", "미뤄진 이동", "미해결 과제"],
      meaning:
        "마음속에 담아 둔 이야기를 털어놓거나 숨겨 둔 사정이 드러날 수 있어요. 떠나고 싶어도 정리되지 않은 일이 발목을 잡기도 해요. 남은 문제를 솔직하게 마주하면 다시 나아갈 수 있어요.",
    },
    waite: {
      upright:
        "journey by water, route, way, envoy, commissionary, expedient.",
      reversed:
        "Declaration, confession, publicity; one account says that it is a proposal of love.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw06.htm",
    },
  },
  {
    id: "swords-07",
    arcana: "minor",
    suit: "swords",
    number: 7,
    nameEn: "Seven of Swords",
    nameKo: "소드 7",
    upright: {
      keywords: ["전략", "계획", "은밀함", "기지", "경계"],
      meaning:
        "정면 돌파보다 전략과 기지로 상황을 풀어 가는 때예요. 계획을 세워 시도하되, 모든 것이 뜻대로 되지는 않을 수 있으니 대안을 마련해 두세요. 주변에 숨은 의도가 있는지도 차분히 살펴보세요.",
    },
    reversed: {
      keywords: ["조언", "정직", "구설", "말조심"],
      meaning:
        "혼자 꾸려 가던 계획을 믿을 만한 사람과 나누며 조언을 얻기 좋은 때예요. 반면 확인되지 않은 말이 오가며 구설에 오를 수 있으니 말조심이 필요해요. 정직한 태도가 결국 나를 지켜 줘요.",
    },
    waite: {
      upright:
        "Design, attempt, wish, hope, confidence; also quarrelling, a plan that may fail, annoyance. The design is uncertain in its import, because the significations are widely at variance with each other.",
      reversed:
        "Good advice, counsel, instruction, slander, babbling.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw07.htm",
    },
  },
  {
    id: "swords-08",
    arcana: "minor",
    suit: "swords",
    number: 8,
    nameEn: "Eight of Swords",
    nameKo: "소드 8",
    upright: {
      keywords: ["제약", "갇힌 느낌", "두려움", "무력감", "자기 제한"],
      meaning:
        "상황에 갇혀 움직일 수 없다고 느끼는 때예요. 하지만 그 제약 중 일부는 두려움이나 생각이 만든 것일 수 있어요. 할 수 있는 작은 행동부터 찾아보면 길이 보이기 시작해요.",
    },
    reversed: {
      keywords: ["해방", "새로운 관점", "뜻밖의 어려움", "벗어남"],
      meaning:
        "스스로를 묶던 생각에서 조금씩 벗어나며 새로운 관점을 얻는 때예요. 다만 예상하지 못한 어려움이 끼어들 수 있으니 서두르지 말고 한 걸음씩 나아가세요. 도움을 청하는 것도 벗어나는 방법이에요.",
    },
    waite: {
      upright:
        "Bad news, violent chagrin, crisis, censure, power in trammels, conflict, calumny; also sickness.",
      reversed:
        "Disquiet, difficulty, opposition, accident, treachery; what is unforeseen; fatality.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw08.htm",
    },
  },
  {
    id: "swords-09",
    arcana: "minor",
    suit: "swords",
    number: 9,
    nameEn: "Nine of Swords",
    nameKo: "소드 9",
    upright: {
      keywords: ["걱정", "불안", "실망", "죄책감", "잠 못 드는 밤"],
      meaning:
        "걱정과 불안이 커져 머릿속이 쉴 틈 없이 복잡한 때예요. 밤이 되면 생각이 더 크게 부풀어 실제보다 상황을 나쁘게 느끼기 쉬워요. 혼자 끙끙 앓기보다 믿을 만한 사람에게 이야기해 보세요.",
    },
    reversed: {
      keywords: ["의심", "수치심", "합리적 걱정", "희망의 빛"],
      meaning:
        "오래 붙들던 걱정이 조금씩 옅어지지만 의심과 부끄러움이 아직 남아 있을 수 있어요. 어떤 걱정은 대비가 필요한 합리적인 신호이니 구분해서 살펴보세요. 나를 탓하기보다 할 수 있는 일에 집중해 보세요.",
    },
    waite: {
      upright:
        "Death, failure, miscarriage, delay, deception, disappointment, despair.",
      reversed:
        "Imprisonment, suspicion, doubt, reasonable fear, shame.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw09.htm",
    },
  },
  {
    id: "swords-10",
    arcana: "minor",
    suit: "swords",
    number: 10,
    nameEn: "Ten of Swords",
    nameKo: "소드 10",
    upright: {
      keywords: ["끝", "고통", "바닥", "마무리", "새벽 전 어둠"],
      meaning:
        "힘든 상황이 가장 깊은 지점에 이르러 더 내려갈 곳이 없는 때예요. 아프지만 하나의 국면이 완전히 끝났다는 신호이기도 해요. 충분히 슬퍼한 뒤 새로 떠오를 아침을 준비해 보세요.",
    },
    reversed: {
      keywords: ["회복 시작", "일시적 이득", "다시 일어섬", "교훈"],
      meaning:
        "가장 어려운 고비를 지나 조금씩 회복이 시작되는 때예요. 상황이 나아지며 작은 이득이나 기회가 생기지만 오래가지 않을 수 있으니 기반을 다져 두세요. 지난 경험에서 얻은 교훈이 다음 걸음을 지켜 줘요.",
    },
    waite: {
      upright:
        "Whatsoever is intimated by the design; also pain, affliction, tears, sadness, desolation. It is not especially a card of violent death.",
      reversed:
        "Advantage, profit, success, favour, but none of these are permanent; also power and authority.",
      source: "https://sacred-texts.com/tarot/pkt/pktsw10.htm",
    },
  },
  {
    id: "swords-11",
    arcana: "minor",
    suit: "swords",
    number: 11,
    nameEn: "Page of Swords",
    nameKo: "소드 페이지",
    upright: {
      keywords: ["호기심", "관찰력", "경계", "탐구", "소식"],
      meaning:
        "날카로운 관찰력과 호기심으로 주변을 살피는 때예요. 정보를 모으고 분석하는 일에서 재능을 발휘할 수 있어요. 성급하게 판단하기보다 꼼꼼히 확인하며 배워 가 보세요.",
    },
    reversed: {
      keywords: ["경솔함", "준비 부족", "뒷말", "의심"],
      meaning:
        "충분히 준비하지 않은 채 말이나 행동이 앞서 곤란해질 수 있어요. 남의 일을 캐거나 뒷말을 옮기는 일은 오해를 부르기 쉬워요. 예상하지 못한 상황에 대비해 차분히 점검해 보세요.",
    },
    waite: {
      upright:
        "Authority, overseeing, secret service, vigilance, spying, examination, and the qualities thereto belonging.",
      reversed:
        "More evil side of these qualities; what is unforeseen, unprepared state; sickness is also intimated.",
      source: "https://sacred-texts.com/tarot/pkt/pktswpa.htm",
    },
  },
  {
    id: "swords-12",
    arcana: "minor",
    suit: "swords",
    number: 12,
    nameEn: "Knight of Swords",
    nameKo: "소드 나이트",
    upright: {
      keywords: ["돌진", "용기", "결단력", "논쟁", "추진력"],
      meaning:
        "목표를 향해 망설임 없이 돌진하는 강한 추진력이 있는 때예요. 용기와 판단력으로 막힌 상황을 빠르게 뚫어 낼 수 있어요. 다만 기세가 지나치면 충돌이 생기니 주변을 살피며 나아가세요.",
    },
    reversed: {
      keywords: ["경솔함", "무모함", "역량 부족", "과한 언행"],
      meaning:
        "생각보다 행동이 앞서 실수를 하거나 감당하기 어려운 일을 벌일 수 있어요. 말이 거칠어져 불필요한 갈등을 부르기도 해요. 속도를 늦추고 내 역량에 맞는 계획부터 세워 보세요.",
    },
    waite: {
      upright:
        "Skill, bravery, capacity, defence, address, enmity, wrath, war, destruction, opposition, resistance, ruin. There is therefore a sense in which the card signifies death, but it carries this meaning only in its proximity to other cards of fatality.",
      reversed:
        "Imprudence, incapacity, extravagance.",
      source: "https://sacred-texts.com/tarot/pkt/pktswkn.htm",
    },
  },
  {
    id: "swords-13",
    arcana: "minor",
    suit: "swords",
    number: 13,
    nameEn: "Queen of Swords",
    nameKo: "소드 퀸",
    upright: {
      keywords: ["명석함", "독립성", "객관성", "솔직함", "경험의 지혜"],
      meaning:
        "아픔을 겪으며 얻은 지혜로 상황을 냉철하게 바라보는 때예요. 감정에 휘둘리지 않고 객관적으로 판단하며 솔직하게 말할 수 있어요. 혼자서도 단단히 설 수 있는 힘을 믿어 보세요.",
    },
    reversed: {
      keywords: ["냉정함", "편협함", "날 선 말", "가식"],
      meaning:
        "판단이 지나치게 냉정해지거나 날 선 말로 상대에게 상처를 줄 수 있어요. 자기 기준만 옳다고 여기면 마음의 문이 닫히기 쉬워요. 엄격함 속에 따뜻함을 조금 더해 보세요.",
    },
    waite: {
      upright:
        "Widowhood, female sadness and embarrassment, absence, sterility, mourning, privation, separation.",
      reversed:
        "Malice, bigotry, artifice, prudery, bale, deceit.",
      source: "https://sacred-texts.com/tarot/pkt/pktswqu.htm",
    },
  },
  {
    id: "swords-14",
    arcana: "minor",
    suit: "swords",
    number: 14,
    nameEn: "King of Swords",
    nameKo: "소드 킹",
    upright: {
      keywords: ["판단력", "권위", "논리", "공정함", "지성"],
      meaning:
        "명확한 논리와 판단력으로 상황을 정리하고 결정을 내리는 때예요. 원칙에 따른 공정한 태도가 주변의 신뢰와 권위를 얻어요. 믿을 만한 사람의 조언을 참고하며 이성적으로 접근해 보세요.",
    },
    reversed: {
      keywords: ["독선", "냉혹함", "권위 남용", "나쁜 의도"],
      meaning:
        "날카로운 지성이 차갑게 쓰이면 독선적이거나 냉혹하게 보일 수 있어요. 힘이나 지위를 앞세워 상대를 몰아붙이지 않도록 주의해 보세요. 숨은 의도가 의심되는 제안은 차분히 검토하는 것이 좋아요.",
    },
    waite: {
      upright:
        "Whatsoever arises out of the idea of judgment and all its connexions-power, command, authority, militant intelligence, law, offices of the crown, and so forth.",
      reversed:
        "Cruelty, perversity, barbarity, perfidy, evil intention.",
      source: "https://sacred-texts.com/tarot/pkt/pktswki.htm",
    },
  },
  {
    id: "pentacles-01",
    arcana: "minor",
    suit: "pentacles",
    number: 1,
    nameEn: "Ace of Pentacles",
    nameKo: "펜타클 에이스",
    upright: {
      keywords: ["새로운 기회", "풍요", "안정", "실질적 시작", "만족"],
      meaning:
        "현실적인 기반을 다질 수 있는 새로운 기회가 찾아오는 때예요. 일이나 생활에서 눈에 보이는 성과로 이어질 씨앗이 심어져요. 기회를 소중히 여기고 차근차근 키워 가 보세요.",
    },
    reversed: {
      keywords: ["놓친 기회", "물질 집착", "불안정", "계획 부족"],
      meaning:
        "좋은 기회가 와도 준비가 부족해 살리지 못하거나 놓칠 수 있어요. 물질적인 것에만 마음이 쏠리면 정작 중요한 만족을 잃기 쉬워요. 무엇이 진짜 나에게 이로운지 따져 보며 계획을 세워 보세요.",
    },
    waite: {
      upright:
        "Perfect contentment, felicity, ecstasy; also speedy intelligence; gold.",
      reversed:
        "The evil side of wealth, bad intelligence; also great riches. In any case it shews prosperity, comfortable material conditions, but whether these are of advantage to the possessor will depend on whether the card is reversed or not.",
      source: "https://sacred-texts.com/tarot/pkt/pktpeac.htm",
    },
  },
  {
    id: "pentacles-02",
    arcana: "minor",
    suit: "pentacles",
    number: 2,
    nameEn: "Two of Pentacles",
    nameKo: "펜타클 2",
    upright: {
      keywords: ["균형", "유연성", "멀티태스킹", "적응", "즐거움"],
      meaning:
        "여러 가지 일을 동시에 굴리며 균형을 잡아 가는 때예요. 변화가 잦아도 유연하게 대처하면 즐겁게 흐름을 탈 수 있어요. 우선순위를 정해 두면 바쁜 와중에도 여유를 지킬 수 있어요.",
    },
    reversed: {
      keywords: ["과부하", "억지 즐거움", "혼란", "우선순위 혼선"],
      meaning:
        "감당할 수 있는 것보다 많은 일을 떠안아 균형이 흔들릴 수 있어요. 괜찮은 척 애써 즐거워 보이려 하면 더 지치기 쉬워요. 할 일을 줄이고 문서나 약속은 꼼꼼히 확인해 보세요.",
    },
    waite: {
      upright:
        "On the one hand it is represented as a card of gaiety, recreation and its connexions, which is the subject of the design; but it is read also as news and messages in writing, as obstacles, agitation, trouble, embroilment.",
      reversed:
        "Enforced gaiety, simulated enjoyment, literal sense, handwriting, composition, letters of exchange.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe02.htm",
    },
  },
  {
    id: "pentacles-03",
    arcana: "minor",
    suit: "pentacles",
    number: 3,
    nameEn: "Three of Pentacles",
    nameKo: "펜타클 3",
    upright: {
      keywords: ["협업", "기술", "인정", "숙련", "성장"],
      meaning:
        "갈고닦은 실력을 발휘하고 그 가치를 인정받는 때예요. 서로 다른 재능을 가진 사람들과 협력하면 더 큰 성과를 낼 수 있어요. 세부 사항까지 정성을 기울이면 평판도 함께 올라가요.",
    },
    reversed: {
      keywords: ["평범함", "협력 부족", "미숙함", "의욕 저하"],
      meaning:
        "일이 기대에 못 미치거나 팀워크가 맞지 않아 성과가 더딜 수 있어요. 사소한 일에 신경을 빼앗기며 큰 그림을 놓치기도 해요. 기본기를 다시 다지고 역할을 분명히 나눠 보세요.",
    },
    waite: {
      upright:
        "Métier, trade, skilled labour; usually, however, regarded as a card of nobility, aristocracy, renown, glory.",
      reversed:
        "Mediocrity, in work and otherwise, puerility, pettiness, weakness.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe03.htm",
    },
  },
  {
    id: "pentacles-04",
    arcana: "minor",
    suit: "pentacles",
    number: 4,
    nameEn: "Four of Pentacles",
    nameKo: "펜타클 4",
    upright: {
      keywords: ["안정", "소유", "지킴", "집착", "보수성"],
      meaning:
        "가진 것을 지키며 안정감을 다지는 데 집중하는 때예요. 기반을 단단히 하는 것은 좋지만 너무 움켜쥐면 흐름이 막힐 수 있어요. 지킬 것과 나눌 것을 균형 있게 정해 보세요.",
    },
    reversed: {
      keywords: ["지연", "정체", "반대", "놓아줌"],
      meaning:
        "계획이 미뤄지거나 반대에 부딪혀 일이 멈춘 듯 느껴질 수 있어요. 지나치게 붙잡고 있던 것을 조금 내려놓으면 새로운 흐름이 생겨요. 조급해하지 말고 상황이 정리되기를 기다려 보세요.",
    },
    waite: {
      upright:
        "The surety of possessions, cleaving to that which one has, gift, legacy, inheritance.",
      reversed:
        "Suspense, delay, opposition.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe04.htm",
    },
  },
  {
    id: "pentacles-05",
    arcana: "minor",
    suit: "pentacles",
    number: 5,
    nameEn: "Five of Pentacles",
    nameKo: "펜타클 5",
    upright: {
      keywords: ["어려움", "결핍", "소외감", "함께 견딤", "도움 요청"],
      meaning:
        "현실적인 어려움이나 결핍 때문에 마음이 위축되는 때예요. 하지만 힘든 시기를 함께 견디며 서로 의지하는 관계가 더 깊어지기도 해요. 혼자 버티기보다 주변에 손을 내밀고 기댈 곳을 찾아보세요.",
    },
    reversed: {
      keywords: ["무질서", "혼란", "불화", "낭비"],
      meaning:
        "상황이 어수선해지고 생활의 질서가 흐트러지기 쉬운 때예요. 순간의 감정으로 무리하게 벌이는 일은 피하는 것이 좋아요. 기본적인 리듬을 되찾으며 차근차근 정돈해 보세요.",
    },
    waite: {
      upright:
        "The card foretells material trouble above all, whether in the form illustrated--that is, destitution--or otherwise. For some cartomancists, it is a card of love and lovers-wife, husband, friend, mistress; also concordance, affinities. These alternatives cannot be harmonized.",
      reversed:
        "Disorder, chaos, ruin, discord, profligacy.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe05.htm",
    },
  },
  {
    id: "pentacles-06",
    arcana: "minor",
    suit: "pentacles",
    number: 6,
    nameEn: "Six of Pentacles",
    nameKo: "펜타클 6",
    upright: {
      keywords: ["나눔", "베풂", "도움", "균형 있는 교환", "감사"],
      meaning:
        "주고받는 흐름이 원활해 도움을 주거나 받기 좋은 때예요. 작은 선물이나 호의가 관계를 따뜻하게 만들어요. 지금 가진 것을 나누는 마음이 더 큰 풍요로 돌아와요.",
    },
    reversed: {
      keywords: ["욕심", "질투", "불균형한 관계", "조건부 호의"],
      meaning:
        "주고받음의 균형이 깨져 한쪽만 애쓰거나 대가를 바라는 호의가 오갈 수 있어요. 남과 비교하며 부러움과 질투가 커지기도 해요. 내가 바라는 것이 무엇인지 솔직하게 들여다보세요.",
    },
    waite: {
      upright:
        "Presents, gifts, gratification another account says attention, vigilance now is the accepted time, present prosperity, etc.",
      reversed:
        "Desire, cupidity, envy, jealousy, illusion.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe06.htm",
    },
  },
  {
    id: "pentacles-07",
    arcana: "minor",
    suit: "pentacles",
    number: 7,
    nameEn: "Seven of Pentacles",
    nameKo: "펜타클 7",
    upright: {
      keywords: ["인내", "중간 점검", "기다림", "장기적 안목", "노력의 결실"],
      meaning:
        "꾸준히 들인 노력이 서서히 자라나는 것을 지켜보는 때예요. 당장의 결과보다 지금까지의 과정을 점검하며 방향을 조정하기 좋아요. 조급해하지 말고 장기적인 안목으로 가꿔 가세요.",
    },
    reversed: {
      keywords: ["조바심", "더딘 결과", "걱정", "방향 재점검"],
      meaning:
        "들인 노력에 비해 결과가 더디게 느껴져 조바심이 날 수 있어요. 돈이나 물건을 주고받는 일이 마음에 걸릴 수 있으니 서로의 약속을 분명히 해 두세요. 방향이 맞는지 다시 점검하면 불안이 줄어들어요.",
    },
    waite: {
      upright:
        "These are exceedingly contradictory; in the main, it is a card of money, business, barter; but one reading gives altercation, quarrels--and another innocence, ingenuity, purgation.",
      reversed:
        "Cause for anxiety regarding money which it may be proposed to lend.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe07.htm",
    },
  },
  {
    id: "pentacles-08",
    arcana: "minor",
    suit: "pentacles",
    number: 8,
    nameEn: "Eight of Pentacles",
    nameKo: "펜타클 8",
    upright: {
      keywords: ["숙련", "성실함", "몰입", "배움", "장인정신"],
      meaning:
        "한 가지 일에 몰입해 실력을 차근차근 쌓아 가는 때예요. 반복되는 과정 속에서 기술이 다듬어지고 성장이 눈에 보이기 시작해요. 아직 준비 단계라도 꾸준함이 결국 큰 차이를 만들어요.",
    },
    reversed: {
      keywords: ["허영", "잔꾀", "헛된 야망", "방향 잃은 노력"],
      meaning:
        "노력이 방향을 잃고 겉모습이나 인정받는 데만 쏠릴 수 있어요. 재주를 지름길이나 잔꾀에 쓰고 싶은 유혹도 생기기 쉬워요. 처음 이 일을 시작한 목적을 떠올리며 기본으로 돌아가 보세요.",
    },
    waite: {
      upright:
        "Work, employment, commission, craftsmanship, skill in craft and business, perhaps in the preparatory stage.",
      reversed:
        "Voided ambition, vanity, cupidity, exaction, usury. It may also signify the possession of skill, in the sense of the ingenious mind turned to cunning and intrigue.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe08.htm",
    },
  },
  {
    id: "pentacles-09",
    arcana: "minor",
    suit: "pentacles",
    number: 9,
    nameEn: "Nine of Pentacles",
    nameKo: "펜타클 9",
    upright: {
      keywords: ["자립", "여유", "성취", "안정", "자기 가치"],
      meaning:
        "스스로의 힘으로 일군 안정과 여유를 누리는 때예요. 신중한 판단과 꾸준한 노력이 확실한 성과로 돌아와요. 나를 위한 시간과 즐거움을 충분히 누려도 좋아요.",
    },
    reversed: {
      keywords: ["불신", "허술한 계획", "속임수", "과시"],
      meaning:
        "겉으로 보이는 화려함에 기대거나 신뢰하기 어려운 제안에 휘말릴 수 있어요. 계획이 허술하면 공들인 일이 흐지부지되기 쉬워요. 약속과 조건을 꼼꼼히 확인하며 자신의 기준을 지켜 보세요.",
    },
    waite: {
      upright:
        "Prudence, safety, success, accomplishment, certitude, discernment.",
      reversed:
        "Roguery, deception, voided project, bad faith.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe09.htm",
    },
  },
  {
    id: "pentacles-10",
    arcana: "minor",
    suit: "pentacles",
    number: 10,
    nameEn: "Ten of Pentacles",
    nameKo: "펜타클 10",
    upright: {
      keywords: ["가족", "유산", "장기적 안정", "전통", "풍요"],
      meaning:
        "오랜 시간에 걸쳐 쌓아 온 기반이 든든하게 자리 잡는 때예요. 가족이나 공동체와의 유대 속에서 안정감과 소속감을 느껴요. 이어받은 것을 소중히 지키며 멀리 내다보는 계획을 세워 보세요.",
    },
    reversed: {
      keywords: ["가족 갈등", "불안정", "뜻밖의 변화", "요행"],
      meaning:
        "가족이나 공동의 일을 두고 의견이 엇갈리거나 안정이 흔들릴 수 있어요. 예상하지 못한 변수가 생기기 쉬우니 요행을 바라는 선택은 피하는 것이 좋아요. 그런 가운데 뜻밖의 도움이나 선물이 찾아오기도 해요.",
    },
    waite: {
      upright:
        "Gain, riches; family matters, archives, extraction, the abode of a family.",
      reversed:
        "Chance, fatality, loss, robbery, games of hazard; sometimes gift, dowry, pension.",
      source: "https://sacred-texts.com/tarot/pkt/pktpe10.htm",
    },
  },
  {
    id: "pentacles-11",
    arcana: "minor",
    suit: "pentacles",
    number: 11,
    nameEn: "Page of Pentacles",
    nameKo: "펜타클 페이지",
    upright: {
      keywords: ["배움", "성실함", "새로운 계획", "집중", "좋은 소식"],
      meaning:
        "새로운 것을 배우고 차근차근 실력을 쌓아 가기 좋은 때예요. 현실적인 계획을 세우고 성실하게 공부하거나 연습하면 결실로 이어져요. 기다리던 소식이나 제안이 찾아올 수도 있어요.",
    },
    reversed: {
      keywords: ["산만함", "낭비", "게으름", "아쉬운 소식"],
      meaning:
        "집중력이 흐트러져 계획만 세우고 실천은 미루게 될 수 있어요. 순간의 즐거움에 시간이나 자원을 흘려보내기 쉬운 때예요. 기대와 다른 소식이 와도 작은 목표부터 다시 세워 보세요.",
    },
    waite: {
      upright:
        "Application, study, scholarship, reflection another reading says news, messages and the bringer thereof; also rule, management.",
      reversed:
        "Prodigality, dissipation, liberality, luxury; unfavourable news.",
      source: "https://sacred-texts.com/tarot/pkt/pktpepa.htm",
    },
  },
  {
    id: "pentacles-12",
    arcana: "minor",
    suit: "pentacles",
    number: 12,
    nameEn: "Knight of Pentacles",
    nameKo: "펜타클 나이트",
    upright: {
      keywords: ["성실함", "책임감", "꾸준함", "신뢰", "실용성"],
      meaning:
        "느리더라도 꾸준하고 성실하게 맡은 일을 해내는 때예요. 책임감 있는 태도가 주변의 믿음을 얻고 실질적인 결과로 이어져요. 화려함보다 쓸모와 내실에 집중해 보세요.",
    },
    reversed: {
      keywords: ["정체", "나태함", "의욕 상실", "지나친 신중함"],
      meaning:
        "지나치게 조심하거나 익숙함에 안주하다 일이 멈춰 버릴 수 있어요. 의욕이 떨어지고 무심해지면서 작은 일도 미루게 되기 쉬워요. 하루 한 가지라도 실천하며 리듬을 되살려 보세요.",
    },
    waite: {
      upright:
        "Utility, serviceableness, interest, responsibility, rectitude-all on the normal and external plane.",
      reversed:
        "inertia, idleness, repose of that kind, stagnation; also placidity, discouragement, carelessness.",
      source: "https://sacred-texts.com/tarot/pkt/pktpekn.htm",
    },
  },
  {
    id: "pentacles-13",
    arcana: "minor",
    suit: "pentacles",
    number: 13,
    nameEn: "Queen of Pentacles",
    nameKo: "펜타클 퀸",
    upright: {
      keywords: ["풍요", "너그러움", "실용적 돌봄", "안정감", "여유"],
      meaning:
        "현실 감각과 따뜻한 마음으로 주변을 넉넉하게 돌보는 때예요. 안정된 기반 위에서 베풀 줄 아는 여유가 생겨요. 생활을 아름답고 편안하게 가꾸는 일에 정성을 들여 보세요.",
    },
    reversed: {
      keywords: ["의심", "불안", "망설임", "불신"],
      meaning:
        "안정을 잃을까 하는 걱정에 마음이 조급해지고 주변을 의심하게 될 수 있어요. 남을 돌보느라 정작 나를 챙기지 못하고 있지는 않은지 살펴보세요. 불안의 원인을 구체적으로 적어 보면 마음이 한결 가벼워져요.",
    },
    waite: {
      upright:
        "Opulence, generosity, magnificence, security, liberty.",
      reversed:
        "Evil, suspicion, suspense, fear, mistrust.",
      source: "https://sacred-texts.com/tarot/pkt/pktpequ.htm",
    },
  },
  {
    id: "pentacles-14",
    arcana: "minor",
    suit: "pentacles",
    number: 14,
    nameEn: "King of Pentacles",
    nameKo: "펜타클 킹",
    upright: {
      keywords: ["성공", "실력", "안정된 기반", "현실 감각", "신뢰"],
      meaning:
        "현실 감각과 실력을 바탕으로 안정된 성과를 이루는 때예요. 일과 생활 모두에서 든든한 기반을 마련하고 주변에 믿음을 줘요. 차분하고 실용적인 판단으로 꾸준히 이끌어 가 보세요.",
    },
    reversed: {
      keywords: ["물질주의", "고집", "원칙 훼손", "유혹"],
      meaning:
        "성과에만 매달리다 융통성을 잃거나 고집스러워질 수 있어요. 눈앞의 이익을 위해 원칙을 굽히고 싶은 유혹은 경계해야 해요. 정직함이 오래가는 성공의 바탕이라는 것을 기억해 보세요.",
    },
    waite: {
      upright:
        "Valour, realizing intelligence, business and normal intellectual aptitude, sometimes mathematical gifts and attainments of this kind; success in these paths.",
      reversed:
        "Vice, weakness, ugliness, perversity, corruption, peril.",
      source: "https://sacred-texts.com/tarot/pkt/pktpeki.htm",
    },
  },
];
