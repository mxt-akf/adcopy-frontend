export const platforms = [
  {
    id: 'amazon',
    name: 'Amazon',
    dotColor: '#FF9900',
    tagBg: '#FFF3E0',
    tagColor: '#E65100',
    scenes: [
      {
        name: '产品标题',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入你现有的产品标题或产品基础信息...', required: true },
          { key: 'keywords', label: '核心关键词', placeholder: '例：wireless earbuds, noise cancelling' },
          { key: 'category', label: '产品品类', placeholder: '例：蓝牙耳机' },
        ],
      },
      {
        name: '5点描述 Bullet Points',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Bullet Points 或产品基础信息...', required: true },
          { key: 'sellingPoints', label: '核心卖点', placeholder: '例：防水、续航30小时、主动降噪' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：运动人群、通勤上班族' },
        ],
      },
      {
        name: '产品描述（段落式）',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有产品描述或产品基础信息...', required: true },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：25-40岁通勤上班族' },
          { key: 'useScene', label: '使用场景', placeholder: '例：户外运动、居家办公' },
          { key: 'brandTone', label: '品牌调性', placeholder: '例：科技感、温暖亲切' },
        ],
      },
      {
        name: 'A+ 内容标题',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 A+ 标题或产品基础信息...', required: true },
          { key: 'contentTheme', label: '内容主题方向', placeholder: '例：品牌故事、功能对比、生活方式' },
        ],
      },
      {
        name: 'A+ 模块文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有模块文案或产品基础信息...', required: true },
          { key: 'moduleType', label: '模块类型', placeholder: '例：对比图、功能介绍、场景图' },
          { key: 'sellingPoints', label: '主打卖点', placeholder: '例：轻薄、长续航' },
        ],
      },
      {
        name: 'Search Terms 关键词',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入产品基础信息或现有关键词...', required: true },
          { key: 'keywords', label: '相关词 / 竞品词', placeholder: '例：bluetooth headphone sport gym' },
          { key: 'useScene', label: '产品用途', placeholder: '例：跑步、健身、通勤' },
        ],
      },
      {
        name: 'Sponsored 广告标题',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有广告标题或产品基础信息...', required: true },
          { key: 'promoFocus', label: '推广重点', placeholder: '例：限时折扣、新品首发、功能卖点' },
          { key: 'keywords', label: '核心关键词', placeholder: '例：wireless earbuds' },
        ],
      },
      {
        name: '品牌推广文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有品牌文案或产品基础信息...', required: true },
          { key: 'brandConcept', label: '品牌理念', placeholder: '例：专注高品质音频20年' },
          { key: 'advantage', label: '差异化优势', placeholder: '例：独家专利降噪技术' },
        ],
      },
      {
        name: '买家评论回复',
        fields: [
          { key: 'reviewContent', label: '买家评论原文', type: 'textarea', rows: 4, placeholder: '粘贴需要回复的买家评论...', required: true },
          { key: 'reviewType', label: '评论类型', type: 'radio', options: ['好评', '中评', '差评'] },
        ],
      },
      {
        name: 'Q&A 问答',
        fields: [
          { key: 'question', label: '买家问题原文', type: 'textarea', rows: 3, placeholder: '例：Is this compatible with iPhone?', required: true },
        ],
      },
      {
        name: 'Deal/促销说明',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有促销文案或产品基础信息...', required: true },
          { key: 'dealInfo', label: '折扣力度', placeholder: '例：买二送一、立减$10' },
          { key: 'dealDeadline', label: '活动时限', placeholder: '例：限时48小时' },
          { key: 'dealScope', label: '适用商品范围', placeholder: '例：全场耳机系列' },
        ],
      },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    dotColor: '#FF2D55',
    tagBg: '#FFF0F3',
    tagColor: '#FF2D55',
    scenes: [
      {
        name: '视频脚本',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有脚本或产品基础信息...', required: true },
          { key: 'videoTheme', label: '视频主题', placeholder: '例：开箱测评、使用教程' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：18-25岁女性' },
        ],
      },
      {
        name: '直播话术',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有直播话术或产品基础信息...', required: true },
          { key: 'liveStage', label: '直播阶段', placeholder: '例：开场预热、逼单冲量、福袋互动' },
        ],
      },
      {
        name: '商品卡标题',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有商品标题或产品基础信息...', required: true },
          { key: 'keywords', label: '核心关键词', placeholder: '例：显瘦、夏季、连衣裙' },
        ],
      },
      {
        name: '商品描述',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有商品描述或产品基础信息...', required: true },
          { key: 'sellingPoints', label: '核心卖点', placeholder: '例：面料亲肤、版型修身' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：职场女性' },
        ],
      },
      {
        name: 'Hashtag 文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入产品基础信息...', required: true },
          { key: 'topic', label: '话题方向', placeholder: '例：穿搭、健身、家居' },
        ],
      },
      {
        name: '评论区互动',
        fields: [
          { key: 'reviewContent', label: '评论内容', type: 'textarea', rows: 4, placeholder: '粘贴需要回复的评论...', required: true },
          { key: 'reviewType', label: '评论类型', type: 'radio', options: ['好评', '中评', '差评'] },
        ],
      },
      {
        name: '达人合作 Brief',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入产品基础信息或现有 Brief...', required: true },
          { key: 'creatorType', label: '达人类型', placeholder: '例：生活类、测评类、穿搭类' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：Z世代、宝妈群体' },
        ],
      },
      {
        name: 'Shop 广告文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有广告文案或产品基础信息...', required: true },
          { key: 'promoFocus', label: '推广重点', placeholder: '例：爆款推荐、限时特惠' },
        ],
      },
      {
        name: '促销 Banner',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Banner 文案或产品基础信息...', required: true },
          { key: 'dealInfo', label: '促销信息', placeholder: '例：5折起，限时24小时' },
        ],
      },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook / Instagram',
    dotColor: '#1877F2',
    tagBg: '#E8F0FE',
    tagColor: '#1877F2',
    scenes: [
      {
        name: 'Feed 广告主文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有广告文案或产品基础信息...', required: true },
          { key: 'painPoint', label: '用户痛点', placeholder: '例：睡眠不好、颈椎疼痛' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：30-45岁职场人群' },
        ],
      },
      {
        name: 'Stories 广告文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Stories 文案或产品基础信息...', required: true },
          { key: 'cta', label: '行动号召', placeholder: '例：立即购买、限时免运费' },
        ],
      },
      {
        name: 'Reels 脚本',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有脚本或产品基础信息...', required: true },
          { key: 'videoTheme', label: '视频主题', placeholder: '例：产品对比、使用前后' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：健身人群' },
        ],
      },
      {
        name: 'Post 有机内容',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Post 内容或产品基础信息...', required: true },
          { key: 'contentTheme', label: '内容主题', placeholder: '例：节日祝福、用户故事' },
        ],
      },
      {
        name: '广告标题 Headline',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有广告标题或产品基础信息...', required: true },
          { key: 'sellingPoints', label: '核心卖点', placeholder: '例：免费试用30天' },
        ],
      },
      {
        name: '落地页文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有落地页文案或产品基础信息...', required: true },
          { key: 'cta', label: '行动号召', placeholder: '例：立即购买、免费试用' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：中小企业主' },
        ],
      },
      {
        name: 'DM 私信话术',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有私信话术或产品基础信息...', required: true },
          { key: 'purpose', label: '私信目的', placeholder: '例：新客转化、老客复购' },
        ],
      },
      {
        name: '评论回复',
        fields: [
          { key: 'reviewContent', label: '评论内容', type: 'textarea', rows: 4, placeholder: '粘贴需要回复的评论...', required: true },
          { key: 'reviewType', label: '评论类型', type: 'radio', options: ['好评', '中评', '差评'] },
        ],
      },
      {
        name: '品牌故事',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有品牌故事或品牌基础信息...', required: true },
          { key: 'brandConcept', label: '品牌理念', placeholder: '例：让每个人都能负担得起好设计' },
          { key: 'advantage', label: '差异化优势', placeholder: '例：手工制作、本地原材料' },
        ],
      },
      {
        name: '促销活动文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有促销文案或产品基础信息...', required: true },
          { key: 'dealInfo', label: '促销信息', placeholder: '例：黑五全场7折' },
          { key: 'dealDeadline', label: '活动时限', placeholder: '例：11月29日截止' },
        ],
      },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify 独立站',
    dotColor: '#96BF48',
    tagBg: '#F1F8E9',
    tagColor: '#558B2F',
    scenes: [
      {
        name: '产品页标题',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有产品标题或产品基础信息...', required: true },
          { key: 'keywords', label: '核心关键词', placeholder: '例：handmade leather wallet' },
          { key: 'category', label: '产品品类', placeholder: '例：钱包、皮具' },
        ],
      },
      {
        name: '产品描述',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有产品描述或产品基础信息...', required: true },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：商务男性、礼品采购' },
          { key: 'useScene', label: '使用场景', placeholder: '例：日常通勤、商务出行' },
        ],
      },
      {
        name: 'SEO Meta 描述',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Meta 描述或产品基础信息...', required: true },
          { key: 'keywords', label: '核心关键词', placeholder: '例：handmade leather wallet men' },
        ],
      },
      {
        name: '首页 Banner 文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Banner 文案或品牌基础信息...', required: true },
          { key: 'brandConcept', label: '品牌主张', placeholder: '例：极简设计、匠心工艺' },
          { key: 'cta', label: '行动号召', placeholder: '例：立即探索、限时免运费' },
        ],
      },
      {
        name: 'Email 营销文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有邮件文案或产品基础信息...', required: true },
          { key: 'emailType', label: '邮件类型', placeholder: '例：弃购挽回、新品上架、节日促销' },
          { key: 'targetAudience', label: '目标受众', placeholder: '例：已购客户、订阅用户' },
        ],
      },
      {
        name: '弃购挽回邮件',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有挽回邮件或产品基础信息...', required: true },
          { key: 'dealInfo', label: '挽回优惠', placeholder: '例：专属9折券，24小时有效' },
        ],
      },
      {
        name: 'Blog 文章',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有文章内容或产品基础信息...', required: true },
          { key: 'topic', label: '文章主题', placeholder: '例：皮具保养指南、送礼选品攻略' },
          { key: 'keywords', label: 'SEO 关键词', placeholder: '例：leather wallet care tips' },
        ],
      },
      {
        name: '促销 Popup 文案',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Popup 文案或产品基础信息...', required: true },
          { key: 'dealInfo', label: '促销信息', placeholder: '例：首单立减$5' },
          { key: 'cta', label: '行动号召', placeholder: '例：领取优惠' },
        ],
      },
      {
        name: '客服话术',
        fields: [
          { key: 'question', label: '客户问题', type: 'textarea', rows: 3, placeholder: '例：物流多久到、支持退换货吗', required: true },
        ],
      },
      {
        name: '品牌 Slogan',
        fields: [
          { key: 'originalCopy', label: '原始文案', type: 'textarea', rows: 4, placeholder: '输入现有 Slogan 或品牌基础信息...', required: true },
          { key: 'brandConcept', label: '品牌理念', placeholder: '例：慢工出细活、每件都是限量' },
          { key: 'advantage', label: '差异化优势', placeholder: '例：全手工、终身保修' },
        ],
      },
    ],
  },
]

export function getSceneConfig(platId, sceneName) {
  const plat = platforms.find(p => p.id === platId)
  return plat?.scenes.find(s => s.name === sceneName) ?? null
}

export function getPlatformById(id) {
  return platforms.find(p => p.id === id)
}