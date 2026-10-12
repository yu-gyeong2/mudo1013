// 무한도전 텔레파시 게임 기본 프리셋 및 데이터 모델

export const DEFAULT_PLAYERS = [
  '유재석',
  '박명수',
  '정준하',
  '정형돈',
  '노홍철',
  '하하',
  '길',
  '조세호',
];

export const YANGJAE_PRESET = {
  id: 'yangjaecheon',
  name: '양재천 텔레파시 레이스 (기본)',
  baseLocation: '양재천 영동2교 하부',
  defaultStartTime: '14:00',
  rounds: [
    {
      id: 1,
      title: '1라운드: 양재천의 첫인상',
      targetWindow: '14:15 ~ 14:45',
      startOffsetMin: 15, // 14:00 기준 15분 후 시작 (14:15)
      durationMin: 30,    // 30분 동안 이동 (14:45 종료)
      clue: '양재천에서 가장 "탁 트이고 넓은" 곳에서 만나자.',
      candidateSpots: [
        '영동2교 밑 넓은 공터',
        '양재천 수변무대',
        '징검다리 앞',
      ],
      missionDetail: '힌트를 확인하자마자 서로 말없이 각자 헤어져서 종료 시각까지 자신이 생각한 장소로 도보 이동합니다.',
      guideNote: '14:45 정각에 같은 장소에 있는 친구들끼리 무한도전 포즈로 상봉 인증샷을 찍으세요!',
    },
    {
      id: 2,
      title: '2라운드: 감성 텔레파시',
      targetWindow: '15:00 ~ 15:30',
      startOffsetMin: 60, // 14:00 기준 60분 후 시작 (15:00)
      durationMin: 30,    // 30분 동안 이동 (15:30 종료)
      clue: '가장 "낭만적이고 감성적인" 산책길로 오시오.',
      candidateSpots: [
        '칸트의 산책길 (밀미리교 근처)',
        '양재천 벼농사 학습장 길',
        '카페거리 입구 산책로',
      ],
      missionDetail: '1라운드 모임 장소(혹은 각자 위치)에서 힌트 확인 후 지정된 시각까지 감성 스팟으로 이동합니다.',
      guideNote: '낭만적인 길목 끝에서 과연 당신의 소울메이트를 만날 수 있을까요?',
    },
    {
      id: 3,
      title: '3라운드: 최후의 상봉',
      targetWindow: '15:45 ~ 16:15',
      startOffsetMin: 105, // 14:00 기준 105분 후 시작 (15:45)
      durationMin: 30,     // 30분 동안 이동 (16:15 종료)
      clue: '우리가 오늘 처음 만났던 곳, 혹은 물을 건너는 곳.',
      candidateSpots: [
        '영동2교 하부 (첫 만남 장소)',
        '징검다리 (물 건너는 곳)',
      ],
      missionDetail: '마지막 승부수! 오늘 처음 만났던 원점인가, 아니면 물을 건너는 징검다리인가?!',
      guideNote: '전원 8명 합체 성공 시 잭팟 보너스 및 뒷풀이 회비 면제!',
    },
  ],
};

export const OTHER_PRESETS = [
  {
    id: 'hangang',
    name: '여의도 한강공원 텔레파시',
    baseLocation: '여의도 물빛광장 앞',
    defaultStartTime: '14:00',
    rounds: [
      {
        id: 1,
        title: '1라운드: 한강의 맛',
        targetWindow: '14:15 ~ 14:45',
        startOffsetMin: 15,
        durationMin: 30,
        clue: '한강 하면 무조건 생각나는 대표 먹거리의 성지!',
        candidateSpots: ['여의도 1호 편의점(한강라면 존)', '배달존 2번 입구', '도깨비야시장 푸드트럭 공터'],
        missionDetail: '힌트를 보고 침샘이 이끄는 그 장소로 각자 이동하세요!',
        guideNote: '정각에 편의점 앞이나 배달존에서 서로 눈이 마주치면 상봉 성공!',
      },
      {
        id: 2,
        title: '2라운드: 피크닉의 낭만',
        targetWindow: '15:00 ~ 15:30',
        startOffsetMin: 60,
        durationMin: 30,
        clue: '가장 돗자리 펴고 멍때리기 좋은 그늘 명당으로 오시오.',
        candidateSpots: ['마포대교 밑 그늘', '피아노 물길 옆 잔디밭', '수상무대 계단'],
        missionDetail: '바람이 살랑살랑 부는 그 자리로 발걸음을 옮기세요.',
        guideNote: '그늘 밑에서 혼자 서성이는 멤버를 발견하면 극적인 포옹!',
      },
      {
        id: 3,
        title: '3라운드: 마지막 석양',
        targetWindow: '15:45 ~ 16:15',
        startOffsetMin: 105,
        durationMin: 30,
        clue: '해 질 녘 강물이 가장 아름답게 반짝이는 랜드마크.',
        candidateSpots: ['I SEOUL U 조형물 앞', '물빛무대 돔 앞', '마포대교 생명의 다리 입구'],
        missionDetail: '노을을 등지고 전원 합체를 이뤄내세요!',
        guideNote: '8명 전원 합체 시 전설의 엔딩 달성!',
      },
    ],
  },
  {
    id: 'campus',
    name: '추억의 캠퍼스/골목 텔레파시',
    baseLocation: '학교 정문 시계탑 앞',
    defaultStartTime: '14:00',
    rounds: [
      {
        id: 1,
        title: '1라운드: 우리의 청춘',
        targetWindow: '14:15 ~ 14:45',
        startOffsetMin: 15,
        durationMin: 30,
        clue: '학창 시절 우리가 가장 많이 모여서 수다 떨던 그 아지트.',
        candidateSpots: ['중앙도서관 앞 벤치', '학생회관 앞 잔디밭', '후문 단골 카페 앞'],
        missionDetail: '수업 끝나고 무조건 집결하던 그 시절 명당으로!',
        guideNote: '추억의 텔레파시가 통하는 친구와 상봉!',
      },
      {
        id: 2,
        title: '2라운드: 고뇌의 순간',
        targetWindow: '15:00 ~ 15:30',
        startOffsetMin: 60,
        durationMin: 30,
        clue: '시험기간마다 한숨 쉬며 커피 마시던 장소.',
        candidateSpots: ['열람실 옥상 흡연구역/휴게존', '단과대 복도 자판기 앞', '기숙사 삼거리'],
        missionDetail: '공부하기 싫을 때 서성이던 그 자리로 오세요.',
        guideNote: '외롭게 자판기를 지키고 있는 친구에게 다가가세요!',
      },
      {
        id: 3,
        title: '3라운드: 뒤풀이의 전설',
        targetWindow: '15:45 ~ 16:15',
        startOffsetMin: 105,
        durationMin: 30,
        clue: '오늘 하루의 피로를 씻어줄 술잔을 기울이던 단골집 골목.',
        candidateSpots: ['후문 먹자골목 사거리', '정문 버스정류장', '동아리방 앞 복도'],
        missionDetail: '최후의 상봉! 마지막 잔을 부딪칠 그곳은?',
        guideNote: '전원 상봉 시 뒷풀이 회비 1등 면제!',
      },
    ],
  },
];

// 게임 규칙 정보
export const GAME_RULES = {
  ironRules: [
    { title: '연락 일체 금지 📱', desc: '카카오톡, 전화, SMS, 위치 공유(Find My, 라이프360 등) 앱 일체 금지!' },
    { title: '오직 도보 이동 🏃', desc: '자전거, 전동 킥보드, 따릉이, 택시, 버스 탑승 절대 금지! 오직 튼튼한 두 다리만 허용.' },
    { title: '시간 엄수 & 상봉 ⏰', desc: '정해진 상봉 시각(예: 14:45)에 정확히 현장에 도착해 마주친 사람끼리만 상봉 인정!' },
    { title: '셀카 인증샷 필수 📸', desc: '모인 멤버끼리 무한도전 포즈 셀카를 남기세요! 혼자 남았다면 고독한 풍경 셀카 인증.' },
  ],
  scoreRules: [
    { title: '함께 모인 그룹', points: '인원수 × 10점', desc: '예: 5명 상봉 시 각자 50점 획득!' },
    { title: '혼자 남은 사람', points: '0점 (해골 💀)', desc: '지독한 고독의 벌칙! 점수 없음.' },
    { title: '8인 전원 합체 잭팟', points: '+100점 보너스', desc: '기적의 텔레파시 달성 시 뒷풀이 회비 전액 면제!' },
  ],
};
