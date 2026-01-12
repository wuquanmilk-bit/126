import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Zap, Globe, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-12 text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
          <Users className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">关于科学学习圈</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          公益科普，免费答疑，分享经验，提升全民科学素养与学习兴趣
        </p>
      </div>

      {/* 使命愿景 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">我们的使命</h2>
          </div>
          <p className="text-gray-700 mb-4">
            以公益性、非营利性为核心，为所有科学爱好者提供免费的科学答疑、经验分享平台，补充校内科学知识，提升科学学习兴趣与综合素养。
          </p>
          <p className="text-gray-700">
            我们相信，科学知识应无门槛共享，每个科学问题都值得被耐心解答，每份学习经验都能点亮他人的科学之路。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-8 w-8 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">我们的愿景</h2>
          </div>
          <p className="text-gray-700 mb-4">
            成为全民科学素养提升的公益平台，让科学学习不再有壁垒，让每个热爱科学的人都能获得免费、优质的学习支持与交流空间。
          </p>
          <p className="text-gray-700">
            我们致力于构建包容、免费、公益的科学生态，帮助学生补充校内知识，帮助爱好者提升兴趣，让科学走进每个人的生活。
          </p>
        </div>
      </div>

      {/* 核心价值 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">我们的核心价值</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">公益免费</h3>
            <p className="text-gray-600 text-sm">非营利性运营，核心服务完全免费</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">答疑解惑</h3>
            <p className="text-gray-600 text-sm">免费解答各类科学问题，补充校内知识</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">提升素养</h3>
            <p className="text-gray-600 text-sm">激发科学兴趣，全面提升科学综合素养</p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-amber-100 rounded-full mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">经验共享</h3>
            <p className="text-gray-600 text-sm">免费发表、交流科学学习经验与方法</p>
          </div>
        </div>
      </div>

      {/* 主要功能 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">我们的主要功能</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-900">科学经验分享</h3>
            </div>
            <p className="text-gray-700 mb-4">
              免费发表科学学习经验、方法与心得，补充校内科学知识体系，帮助更多人找到适合自己的科学学习路径。
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                校内知识拓展与补充
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                免费分享学习方法与技巧
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                科学学习心得交流互动
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <h3 className="text-2xl font-semibold text-gray-900">科学免费答疑</h3>
            </div>
            <p className="text-gray-700 mb-4">
              提出您的科学困惑，获取免费、专业的解答；用您的知识帮助他人，共同提升科学素养与学习兴趣。
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                全品类科学问题免费解答
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                校内科学知识专项答疑
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                公益化、非营利性答疑服务
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 创始故事 */}
<div className="mb-12">
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">创始故事</h2>
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-gray-700 mb-4 leading-relaxed">
        2025年，AI技术迎来突破性飞跃，而传统科学知识传播与答疑模式却仍停留在低效、有门槛的阶段——校内知识体系更新滞后，付费答疑的壁垒让大量求知者止步，科学学习的效率与公平性亟待改变。
      </p>
      <p className="text-gray-700 mb-4 leading-relaxed">
        我们敏锐捕捉到这一核心矛盾：前沿AI技术本应成为知识普惠的利器，却未被充分应用于科学教育领域。为此，我们下定决心打造科学学习圈，依托AI技术构建智能答疑系统，打破付费壁垒，填补校内知识空白，让高效、免费的科学答疑与知识分享成为常态。
      </p>
      <p className="text-gray-700 font-medium leading-relaxed">
        以AI技术破局传统知识传播的困境，用公益底色保障科学学习的公平性——这就是科学学习圈的初心：让前沿技术赋能每一个求知者，终结科学学习的低效与不公。
      </p>
    </div>
  </div>
</div>

      {/* 联系我们 */}
      <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">加入我们</h2>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-700 mb-6">
            无论您是学生、教师，还是科学爱好者，我们都欢迎您加入这个公益平台——免费提问、免费分享、共同提升科学素养。
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">分享学习经验</h4>
              <p className="text-sm text-gray-600">免费发表您的科学学习心得，补充校内知识体系</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">解答科学问题</h4>
              <p className="text-sm text-gray-600">用您的知识免费帮助他人，提升全民科学兴趣</p>
            </div>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">联系我们</h3>
            <p className="text-gray-700 mb-2">如有合作、建议或疑问，请随时联系我们（公益沟通，无任何收费）：</p>
            <p className="text-lg font-medium text-blue-600 mb-4">115382613@qq.com</p>
            <p className="text-gray-600 text-sm">我们会在24小时内回复您的邮件，所有服务均为公益非营利性质</p>
          </div>
        </div>
      </div>

      {/* 返回链接 */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
        >
          免费探索科学学习圈
        </Link>
      </div>
    </div>
  );
}