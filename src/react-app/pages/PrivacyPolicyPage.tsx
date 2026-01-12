import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Lock, Eye, UserCheck, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-8 text-center">
        <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">隐私政策</h1>
        <p className="text-gray-600">最近更新日期：2026年1月</p>
      </div>

      {/* 内容 */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="prose max-w-none">
          {/* 简介 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              引言
            </h2>
            <p className="text-gray-700 mb-4">
              欢迎使用科学学习圈！科学学习圈是面向科普爱好者、学生及教育工作者的科学交流与学习平台，我们深知个人信息保护对您的重要性。本隐私政策旨在清晰说明科学学习圈如何收集、使用、存储和保护您在使用平台服务（包括科普内容浏览、学习交流、问答互动等）过程中产生的个人信息，以及您所享有的相关权利。
            </p>
            <p className="text-gray-700">
              当您注册、登录并使用科学学习圈的各项服务时，即表示您同意我们按照本隐私政策处理您的个人信息。如您对本政策有任何疑问或异议，请通过页面底部的联系方式与我们沟通。
            </p>
          </div>

          {/* 信息收集 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6" />
              我们收集的信息
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">1. 账户信息</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>注册时提供的用户名、电子邮箱地址（用于账户验证及学习通知接收）</li>
                <li>个人资料信息（如头像、学科偏好、学习阶段等，便于个性化科普内容推荐）</li>
                <li>账户安全信息（如登录密码哈希值、密保问题等，保障账户及学习数据安全）</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">2. 学习与内容信息</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>您发布的科学感悟、学习提问、科普评论、答题记录等内容</li>
                <li>与其他用户的学习互动记录（如评论回复、问答交流、学习小组讨论记录）</li>
                <li>科普文章、教学视频、学科题库的浏览和阅读历史，以及学习时长统计</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">3. 服务使用信息</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>设备信息（设备类型、操作系统、浏览器类型，用于适配不同终端的学习体验）</li>
                <li>IP地址和粗略地理位置信息（仅用于优化区域化科普内容推荐，如本地科教资源）</li>
                <li>访问时间、页面停留时间、学习功能使用频率等数据（用于分析学习行为，提升服务体验）</li>
              </ul>
            </div>
          </div>

          {/* 信息使用 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              信息使用方式
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">我们仅将收集的信息用于科学学习圈平台的服务优化与学习体验提升，具体包括：</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>提供、维护和优化科普学习服务（如问答匹配、内容推送、学习工具使用）</li>
                <li>管理您的账户，展示个性化学习资料和学科偏好设置</li>
                <li>发送学习相关通知（如新科普内容上线、问答回复提醒、学习任务更新）</li>
                <li>保护平台学习环境的安全性，防范恶意刷屏、内容侵权等违规行为</li>
                <li>根据您的学习偏好推送适配的科普文章、教学视频和学科练习题</li>
                <li>分析学习数据，优化内容排版、功能布局和知识点讲解方式</li>
                <li>遵守教育相关法律法规，配合监管部门的合规检查</li>
              </ul>
            </div>
          </div>

          {/* 信息共享 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              信息共享
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">科学学习圈承诺不会将您的个人学习信息出售、出租给任何第三方。仅在以下必要场景下共享信息：</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>征得您的明确同意（如您授权第三方学习工具同步您的答题记录）</li>
                <li>为提供您要求的学习服务而必要的第三方（如支付服务商、云存储服务商，仅获取完成服务所需的最小信息）</li>
                <li>遵守教育、网络安全相关法律法规，或响应司法机关的合法调查要求</li>
                <li>保护科学学习圈平台用户的学习权益、财产安全，或防范违法违规的科普内容传播</li>
                <li>在平台业务转让、合并时，作为资产一部分的匿名化学习数据交接（需确保数据不可识别个人）</li>
              </ul>
            </div>
          </div>

          {/* 数据安全 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">数据安全</h2>
            <p className="text-gray-700 mb-4">
              科学学习圈针对学习数据采取多层级安全保护措施：包括数据加密存储、访问权限分级管控、定期安全审计等技术手段，同时建立完善的信息安全管理制度，防止您的学习记录、个人资料被未经授权的访问、篡改或泄露。
            </p>
            <p className="text-gray-700">
              尽管我们已采取严格的安全措施，但请注意互联网传输和电子存储存在固有风险。科学学习圈无法完全保证个人信息的绝对安全，如发生不可抗力的安全事件，我们将第一时间采取补救措施，并按照法律法规要求通知您。
            </p>
          </div>

          {/* 您的权利 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">您的权利</h2>
            <div className="space-y-2 text-gray-700">
              <p>根据《个人信息保护法》等相关法规，您对自己的学习信息享有以下权利：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>访问您的个人学习数据（如答题记录、浏览历史、发布的科普内容）</li>
                <li>更正不准确的个人资料（如学科偏好、学习阶段）或错误的学习记录</li>
                <li>申请删除您的账户及全部学习信息（法律法规要求留存的除外）</li>
                <li>限制或反对非必要的学习信息处理（如个性化内容推荐）</li>
                <li>获取您的个人信息副本（如导出答题记录、发布的评论内容）</li>
                <li>撤回同意（如撤回个性化推荐的授权，不影响已完成的合法处理）</li>
              </ul>
            </div>
          </div>

          {/* 儿童隐私 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">儿童隐私</h2>
            <p className="text-gray-700">
              科学学习圈重视未成年人的学习与隐私保护，平台服务主要面向16岁以上的青少年及成人。对于16岁以下儿童使用本平台，需在父母或监护人的陪同和授权下进行，且我们仅收集必要的、用于保障学习服务的基础信息（如监护人验证信息）。如监护人发现儿童未经授权提交了个人信息，请立即与我们联系，我们将免费删除相关信息并采取保护措施。
            </p>
          </div>

          {/* 政策更新 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">隐私政策更新</h2>
            <p className="text-gray-700 mb-4">
              随着科学学习圈的功能迭代（如新增学科学习工具、科普内容形式）或相关法律法规的更新，我们可能会修订本隐私政策。如发生影响您权益的重大变更，我们将通过平台弹窗、站内信等方式通知您，并在政策顶部更新"最后更新"日期。
            </p>
            <p className="text-gray-700">
              建议您定期查阅本隐私政策，了解我们对您学习信息的保护措施及规则变化。
            </p>
          </div>

          {/* 联系我们 */}
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              联系我们
            </h3>
            <p className="text-gray-700 mb-4">
              如您对本隐私政策、个人学习信息的处理有任何疑问、投诉或申请（如信息更正、删除），请通过以下方式联系科学学习圈客服团队：
            </p>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">电子邮箱：115382613@qq.com</p>
              <p className="text-gray-700">我们将在15个工作日内回复您的咨询，并依法处理您的合理请求。</p>
            </div>
          </div>

          {/* 免责声明 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              本隐私政策仅适用于科学学习圈平台的服务场景，不适用第三方链接或合作服务。本政策的中文版本为最终有效版本，仅供学习和科普服务相关的合规参考，不构成法律建议。如您有法律层面的疑问，建议咨询专业律师。
            </p>
          </div>
        </div>
      </div>

      {/* 返回链接 */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}