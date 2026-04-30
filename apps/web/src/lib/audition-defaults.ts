export const DEFAULT_PRIMARY_COLOR = '#d6b37a'
export const DEFAULT_ACCENT_COLOR = '#df2f39'

export type AuditionData = {
  theme: {
    primaryColor: string
    accentColor: string
  }
  media: {
    heroImage: string
    featureImage: string
    lumiBackgroundImage: string
  }
  hero: {
    eyebrow: string
    audition: string
    titleLine1Prefix: string
    titleHighlight: string
    titleLine1Suffix: string
    titleLine2: string
    lead: string
    stats: { label: string; value: string; sub: string }[]
    primaryHref: string
    primaryLabel: string
    secondaryHref: string
    secondaryLabel: string
  }
  about: {
    label: string
    titleLine1: string
    titleLine2: string
    note: string
    paragraphs: string[]
    scoreboard: { label: string; value: string; desc: string }[]
  }
  tracks: {
    label: string
    titleLine1: string
    titleLine2: string
    note: string
    platformPanelTitle: string
    platformPanelDesc: string
    platforms: { iconPath: string; name: string; desc: string }[]
    damPanelTitle: string
    damPanelDesc: string
    mvSectionLabel: string
    mvSectionTitleLine1: string
    mvSectionTitleLine2: string
    mvSectionNote: string
    mvs: {
      youtubeId: string
      startSeconds?: string
      kicker: string
      title: string
      desc: string
      href: string
    }[]
  }
  groups: {
    label: string
    titleLine1: string
    titleLine2: string
    note: string
    items: {
      badge: string
      name: string
      nameKana: string
      meta: string
      desc: string
      highlights: string[]
      logoPath: string
      logoAlt: string
      visualVariant: 'default' | 'lumi'
      reveal: 'left' | 'right' | 'zoom'
    }[]
  }
  support: {
    label: string
    title: string
    note: string
    reasons: {
      no: string
      title: string
      desc: string
      reveal: 'left' | 'zoom' | 'right'
    }[]
  }
  flow: {
    label: string
    title: string
    note: string
    steps: { step: string; title: string; desc: string }[]
  }
  requirements: {
    label: string
    title: string
    note: string
    items: { title: string; desc: string }[]
  }
  conditions: {
    label: string
    titleLine1: string
    titleLine2: string
    note: string
    rows: {
      category: string
      beforeDebut: string
      afterDebut: string
      oneYear: string
    }[]
  }
  faq: {
    label: string
    title: string
    note: string
    items: { question: string; answer: string }[]
  }
  cta: {
    label: string
    titleLine1: string
    titleLine2: string
    desc: string
    primaryHref: string
    primaryLabel: string
    secondaryHref: string
    secondaryLabel: string
  }
}

export const AUDITION_DEFAULTS: AuditionData = {
  theme: {
    primaryColor: DEFAULT_PRIMARY_COLOR,
    accentColor: DEFAULT_ACCENT_COLOR,
  },
  media: {
    heroImage: '/audition/assets/hero-fv.jpg',
    featureImage: '/audition/assets/audition-2027-announcement.jpg',
    lumiBackgroundImage: '/audition/assets/live-stage.jpg',
  },
  hero: {
    eyebrow: 'Cinderella entertainment audition',
    audition: 'Audition',
    titleLine1Prefix: '夢を',
    titleHighlight: '現実（リアル）',
    titleLine1Suffix: 'へ。',
    titleLine2: '新メンバー募集。',
    lead: '“自由”と“挑戦”に可能性を創り出し、新たな“エンターテインメント”を届ける。 Cinderella entertainment は、あなたの夢を実現する魔法の杖。 大阪から、夢と輝きを全国へ届ける次世代メンズアイドルを募集します。',
    stats: [
      { label: 'Base', value: 'Osaka', sub: '大阪を起点に、全国へ広がる輝きをつくる。' },
      { label: 'Debut', value: '~6ヶ月', sub: '合格から約6ヶ月を目安にデビューへ進行。' },
      { label: 'Track', value: '100%', sub: '全員デビュー前提で選考する体制です。' },
    ],
    primaryHref: '#entry',
    primaryLabel: '今すぐエントリー',
    secondaryHref: '#about',
    secondaryLabel: 'Cinderellaとは',
  },
  about: {
    label: 'About',
    titleLine1: '夢を抱くだけで終わらせず、',
    titleLine2: '夢を現実へ変えていく。',
    note: '未経験から、確かに応援される存在へ。あなたの個性と本気を、楽曲・映像・ライブのすべての舞台で輝かせます。',
    paragraphs: [
      '「大阪から、夢と輝きを全国へ」。 関西のカルチャーと熱量を原動力に、次世代を担うメンズアイドルを創出します。 夢を持つ者もがシンデレラに。そう言い切れるだけの行動と投資を重ねています。',
      'シンデレラでは、まず「売れる」ことから始めます。 認知と収益が生まれ、長く続けることで技術も磨かれていく。 その上でファンへのサービスを深め、「本物のアイドル」を目指していきます。',
    ],
    scoreboard: [
      {
        label: 'Founded',
        value: '2023.08',
        desc: '設立直後から複数グループを立ち上げ、運営を推進。',
      },
      { label: 'Location', value: '大阪', desc: '主な活動拠点は大阪。全国への展開を視野に運営。' },
      {
        label: 'Experience',
        value: '未経験歓迎',
        desc: '現在のメンバーの多くが未経験からスタート。',
      },
      { label: 'Vision', value: '5-10年', desc: '5年から10年続くグループづくりを視野に設計。' },
    ],
  },
  tracks: {
    label: 'Track Record',
    titleLine1: '配信と映像で、',
    titleLine2: '実績を示す。',
    note: 'あなたの歌声と姿は、ストリーミング、MV、カラオケ、街中のBGMまで届く。多くの人と出会えるステージが、ここにあります。',
    platformPanelTitle: '主要プラットフォームで展開',
    platformPanelDesc:
      'Apple Music、Spotify、TikTok、YouTube など、新たなファンと出会う場所へ、確実に楽曲を届ける。約50曲を各種ストリーミングサイトで配信し、オンラインでも熱量が伝わる導線を重ねています。',
    platforms: [
      {
        iconPath: '/audition/assets/apple-music.svg',
        name: 'Apple Music',
        desc: '音源接点の強い定番プラットフォーム',
      },
      {
        iconPath: '/audition/assets/spotify.svg',
        name: 'Spotify',
        desc: '新規リスナー獲得に強いストリーミング導線',
      },
      {
        iconPath: '/audition/assets/tiktok.svg',
        name: 'TikTok',
        desc: '拡散と発見を生みやすい短尺動画接点',
      },
      {
        iconPath: '/audition/assets/youtube.svg',
        name: 'YouTube',
        desc: 'MVとライブ映像で世界観を伝える基盤',
      },
    ],
    damPanelTitle: 'DAM配信など、実績の見え方も強い。',
    damPanelDesc:
      'ただ音源を並べるのではなく、届き方そのものを設計する。カラオケ、放送、タイアップなど、応援の理由が増えていく実績形成にも投資しています。',
    mvSectionLabel: 'Music Videos',
    mvSectionTitleLine1: 'MVという証明が、',
    mvSectionTitleLine2: '世界観の厚みになる。',
    mvSectionNote:
      '歌だけじゃない、表情も世界観もすべてが作品になる。あなたの魅力を全方位から伝えるMVを、ここで残していけます。',
    mvs: [
      {
        youtubeId: 'Cg2UF5GqJzw',
        kicker: 'MV 01',
        title: 'ライブの熱量をそのまま映像へ',
        desc: 'ステージで爆発する熱量と、ファンと一体になる瞬間。あなたもこの景色の真ん中に立てる。',
        href: 'https://www.youtube.com/watch?v=Cg2UF5GqJzw',
      },
      {
        youtubeId: 'CT8IMsUV9nM',
        startSeconds: '1',
        kicker: 'MV 02',
        title: '世界観づくりまで見える映像展開',
        desc: '楽曲の世界観を映像で表現する。歌って踊るだけじゃない、表現者としての可能性が広がる。',
        href: 'https://www.youtube.com/watch?v=CT8IMsUV9nM&t=1s',
      },
      {
        youtubeId: 'WikZL9akqh0',
        kicker: 'MV 03',
        title: '推せる理由が映像でも積み上がる',
        desc: '初めて見た人さえ惹き込む、グループならではの空気感。あなたが加わる未来の物語が、ここから始まる。',
        href: 'https://www.youtube.com/watch?v=WikZL9akqh0',
      },
      {
        youtubeId: 'T162bkpr_5E',
        kicker: 'MV 04',
        title: '既存実績の厚みを一画面で見せる',
        desc: '一本だけじゃない、何作も残せる場所。アーティストとしての軌跡を、ここで積み上げていける。',
        href: 'https://www.youtube.com/watch?v=T162bkpr_5E',
      },
    ],
  },
  groups: {
    label: 'Groups',
    titleLine1: 'すでに走っているグループがいる。',
    titleLine2: 'だから未来像が明確になる。',
    note: '抽象的な「いつか」ではなく、どんな速度で、どこまで届くのか。既存グループの歩みそのものが、その答えになります。',
    items: [
      {
        badge: 'Featured Group',
        name: 'Neo Aster',
        nameKana: 'ネオアスター',
        meta: '2024.04.21 debut / 4 members',
        desc: '王道感と推進力を併せ持つグループ。ライブの説得力だけでなく、外部への波及も実績として示してきました。',
        highlights: [
          '1stアルバムで週間オリコンチャート2位',
          '毎日放送「かまいたちの知らんけど」EDテーマ',
          '日本テレビ系「バズリズム02」出演',
          'FamilyMart店内放送・ビジョンで楽曲展開',
          '朝日放送テレビ「Music House」2026年1月度EDテーマ',
        ],
        logoPath: '/audition/assets/neoaster-logo.png',
        logoAlt: 'Neo Aster logo',
        visualVariant: 'default',
        reveal: 'left',
      },
      {
        badge: 'Growing Fast',
        name: "Lumi7's",
        nameKana: 'ルミナス',
        meta: '2024.04.04 debut / 5 members',
        desc: '立ち上がりの勢いそのままに、ライブ規模も注目度も拡大中。成長曲線が明快だからこそ、新メンバー募集にも説得力が宿ります。',
        highlights: [
          '1周年単独ライブを Zepp Namba で開催し500名動員',
          '2026年4月28日に なんばHatch 公演を予定',
          '大阪拠点で急成長中の注目グループとして展開',
          'ライブとSNSの両輪でファンコミュニティを拡張',
        ],
        logoPath: '/audition/assets/lumi7s-logo.png',
        logoAlt: "Lumi7's logo",
        visualVariant: 'lumi',
        reveal: 'right',
      },
    ],
  },
  support: {
    label: 'Support',
    title: 'シンデレラのグループが人気の理由。',
    note: '活動への投資、活動に専念できる環境、運営の熱量。この三つが噛み合うことで、成長は偶然に左右されにくくなります。',
    reasons: [
      {
        no: '01 / Creative',
        title: '活動への投資',
        desc: '約2ヶ月に1回の新曲制作、有名作曲家への依頼、専属ダンス・ボイスレッスン、定期的な新衣装制作まで。伸び続けるために必要な投資を継続します。',
        reveal: 'left',
      },
      {
        no: '02 / Environment',
        title: '活動に専念できる環境',
        desc: 'イベント会場への送迎、撮影、編集、SNS更新サポートなど、表に出ない部分まで整え、活動に集中できる時間を増やします。',
        reveal: 'zoom',
      },
      {
        no: '03 / Management',
        title: '運営の熱量',
        desc: '主に30代前後の男性マネジメント陣が、公私を超えた関係性を大切にしながら支える。仕事に100%向き合い、活動を120%バックアップする体制です。',
        reveal: 'right',
      },
    ],
  },
  flow: {
    label: 'Flow',
    title: '合格からデビューまでの流れ。',
    note: '合格後は、契約、準備、プレデビューを経て、約6ヶ月を目安にデビューを目指します。',
    steps: [
      {
        step: 'Step 01',
        title: 'オーディション合格',
        desc: '書類や面談など複数の審査を通じて、将来性と相性を丁寧に見ます。',
      },
      {
        step: 'Step 02',
        title: '契約と活動準備',
        desc: '契約内容はオンラインでも確認可能。必要に応じて保護者の同席にも対応します。',
      },
      {
        step: 'Step 03',
        title: 'レッスン・撮影・SNS整備',
        desc: '歌やダンスだけでなく、見せ方や発信も含めてプレデビューの準備を進めます。',
      },
      {
        step: 'Step 04',
        title: 'プレデビュー',
        desc: '舞台に立つ前から、オンラインや撮影素材を通じて応援される入口をつくります。',
      },
      {
        step: 'Step 05',
        title: '正式デビュー',
        desc: 'お客様の前でデビューライブを実施。その後は月10〜15回ほどのイベント出演を想定しています。',
      },
    ],
  },
  requirements: {
    label: 'Requirements',
    title: '弊社で求めるアイドルの人物像',
    note: '経験よりも、まっすぐな気持ちと素直さ。ファンを大切にできる人と、長く一緒に走っていきたい。',
    items: [
      {
        title: '合格基準',
        desc: '「アイドル活動未経験」でも一切問題ありません。現在のメンバー8割は未経験です。',
      },
      {
        title: '人物像',
        desc: '「素直でいいやつ」です。素直なやつは「成長」し、いいやつは「周りから応援される」人です。私たちは、グループとしての活動と、ファンを喜ばせることを最優先します。',
      },
      {
        title: 'アイドルとして',
        desc: 'メンズアイドルの価値の最も重要なものは「今日来てくれたファンを幸せにできるか」です。「稼ぎたいから」アイドルをやる人は弊社には不要です。',
      },
      {
        title: '長く常に成長',
        desc: 'メンズアイドルグループの平均年数は1.5年と言われています。弊社では今後5年〜10年活動できるようなグループを作ることをビジョンとしておりますので、短期目線でやりたい方は合わないかもしれないです。',
      },
      {
        title: '他者を尊重',
        desc: '応援してくれるファンの皆様、サポートしてくれるスタッフ、イベント会場の設営の方、最も近くにいる味方の家族。それぞれの方々に対して、リスペクトと感謝が必要です。',
      },
    ],
  },
  conditions: {
    label: 'Conditions',
    titleLine1: '合格後の条件と、',
    titleLine2: '活動イメージについて。',
    note: '寮も送迎も会社が支える。アイドルとしての活動に、安心して全力を注げる環境を用意しています。',
    rows: [
      {
        category: '寮',
        beforeDebut: '100%会社負担',
        afterDebut: '100%会社負担',
        oneYear: '寮から卒業し、\n一人暮らしするメンバーもいます',
      },
      {
        category: '送迎',
        beforeDebut: 'レッスン場所までは自身で通勤',
        afterDebut: 'イベント時は完全送迎',
        oneYear: 'イベント時は完全送迎',
      },
      {
        category: '休日',
        beforeDebut:
          '不定期となります。\nおおよそ月に16日程度活動日ですが、\n活動日以外にTikTokライブや、個人練習をするメンバーも多いです。',
        afterDebut: '同左',
        oneYear: '同左',
      },
      {
        category: '確定申告',
        beforeDebut: '弊社で税理士ご紹介可能です。\n所属メンバーの8割が利用しています。',
        afterDebut: '同左',
        oneYear: '同左',
      },
    ],
  },
  faq: {
    label: 'FAQ',
    title: 'よくある質問',
    note: '応募前に気になる、契約・費用・デビュー・生活のこと。あなたの不安に、ひとつずつお答えします。',
    items: [
      {
        question: 'Q. 「契約期間3年」ですが、契約期間満了後が不安です。',
        answer:
          '契約期間は3年ですが、もちろん更新をしてアイドル活動を続けることは可能です。また「アイドル活動」から卒業した過去の卒業生の中には弊社が支援して、「自身のプロデュースしたグループのマネジメント」や「メンズコンカフェ」をオープンした方もいます。セカンドキャリアも支援可能です！',
      },
      {
        question: 'Q. 合格後、レッスン費用などの「自己負担」となる費用はありますか？',
        answer:
          '基本的な自己負担は一切ございません。レッスン会場、打ち合わせのために事務所までの交通費は自己負担となりますが、東京への移動費などは会社負担となりますのでご安心ください。',
      },
      {
        question: 'Q. 他のプロダクションでは合格したけどデビューできないこともよく聞きます。',
        answer:
          '弊社は、まだ小さなプロダクションです。そのため、練習生を集めることはなく、全員デビューすることを前提で合格通知を出させていただいております。過去のデビューまでの割合は100%です。',
      },
      {
        question: 'Q. 初めて親元を離れる生活が不安です。',
        answer:
          'これからデビューの皆さんは20歳前後の方が多いです。そのため、弊社のメンバーはほとんどが初めて親元を離れた生活を送っています。生活の仕方や大阪での遊び方なども含めて皆さんに指導し、趣味を見つけることや行ってはいけない場所も含めてマネジメントいたします。',
      },
    ],
  },
  cta: {
    label: 'Entry',
    titleLine1: '夢を現実へ変える一歩を、',
    titleLine2: 'ここから。',
    desc: '未経験でも構いません。必要なのは、行動し続ける意志。Cinderella entertainment とともに、夢を現実へ変えていく最初の一歩を踏み出してください。',
    primaryHref: 'https://forms.gle/',
    primaryLabel: 'エントリーフォームへ',
    secondaryHref: '#tracks',
    secondaryLabel: '実績をもう一度見る',
  },
}
