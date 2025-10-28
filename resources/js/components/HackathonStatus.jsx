import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import QRCodeDisplay from './QRCodeDisplay';

const HackathonStatus = ({ registration, onEdit }) => {
	const { t, language } = useLanguage();

	const getStatusConfig = (status) => {
		const configs = {
			'pending': {
				bg: 'bg-gradient-to-r from-yellow-400 to-orange-400',
				text: 'text-white',
				icon: '⏳',
				title: language === 'ar' ? 'قيد المراجعة' : 'Under Review',
				description: language === 'ar' 
					? 'طلبك قيد المراجعة من قبل فريقنا المختص' 
					: 'Your application is being reviewed by our team'
			},
			'approved': {
				bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
				text: 'text-white',
				icon: '✅',
				title: language === 'ar' ? 'تم القبول' : 'Approved',
				description: language === 'ar' 
					? 'مبروك! تم قبول طلبك للمشاركة في الهاكثون' 
					: 'Congratulations! Your application has been approved'
			},
			'rejected': {
				bg: 'bg-gradient-to-r from-red-400 to-pink-500',
				text: 'text-white',
				icon: '❌',
				title: language === 'ar' ? 'تم الرفض' : 'Rejected',
				description: language === 'ar' 
					? 'نعتذر، لم يتم قبول طلبك هذه المرة' 
					: 'Sorry, your application was not approved this time'
			}
		};
		return configs[status] || configs['pending'];
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getSkillsText = (skills) => {
		if (!skills || !Array.isArray(skills)) return '';
		
		const skillLabels = {
			'programming': language === 'ar' ? 'البرمجة' : 'Programming',
			'design': language === 'ar' ? 'التصميم' : 'Design',
			'data_analysis': language === 'ar' ? 'تحليل البيانات' : 'Data Analysis',
			'marketing': language === 'ar' ? 'التسويق' : 'Marketing',
			'project_management': language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
			'other': language === 'ar' ? 'أخرى' : 'Other'
		};

		return skills.map(skill => skillLabels[skill] || skill).join(', ');
	};

	const getBackgroundText = (background) => {
		const backgrounds = {
			'computer_science': language === 'ar' ? 'علوم الحاسب' : 'Computer Science',
			'engineering': language === 'ar' ? 'الهندسة' : 'Engineering',
			'business': language === 'ar' ? 'إدارة الأعمال' : 'Business',
			'design': language === 'ar' ? 'التصميم' : 'Design',
			'other': language === 'ar' ? 'أخرى' : 'Other'
		};
		return backgrounds[background] || background;
	};

	const statusConfig = getStatusConfig(registration.status);

	return (
		<div className="max-w-5xl mx-auto overflow-x-hidden">
			{/* Status Header */}
			<div className={`${statusConfig.bg} ${statusConfig.text} rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-2xl relative overflow-hidden`}>
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white transform -translate-x-16 -translate-y-16"></div>
					<div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white transform translate-x-12 translate-y-12"></div>
					<div className="absolute top-1/2 left-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white transform -translate-x-8 -translate-y-8"></div>
				</div>
				
				<div className="relative z-10">
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
						<div className="flex items-center space-x-4 sm:space-x-6 rtl:space-x-reverse">
							<div className="text-4xl sm:text-5xl animate-bounce">
								{statusConfig.icon}
							</div>
							<div>
								<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
									{statusConfig.title}
								</h2>
								<p className="text-base sm:text-lg opacity-95 leading-relaxed break-words">
									{statusConfig.description}
								</p>
							</div>
						</div>
						<div className="text-center lg:text-right bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 w-full sm:w-auto sm:min-w-[200px]">
							<div className="text-xs sm:text-sm opacity-80 mb-1">
								{language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
							</div>
							<div className="font-bold text-base sm:text-lg break-words">
								{formatDate(registration.created_at)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Registration Details */}
			<div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-in slide-in-from-top-4">
				<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3"></div>
					<div className="p-5 sm:p-8 lg:p-12">
						<div className="flex items-center mb-6 sm:mb-8">
							<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 sm:p-4 rounded-2xl mr-3 sm:mr-4">
								<span className="text-xl sm:text-2xl">📋</span>
							</div>
							<h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
								{language === 'ar' ? 'تفاصيل التسجيل' : 'Registration Details'}
							</h3>
						</div>

						<div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
							{/* Personal Information */}
							<div className="space-y-4 sm:space-y-6">
								<div className="flex items-center space-x-3 rtl:space-x-reverse">
									<div className="bg-blue-100 p-2 rounded-lg">
										<span className="text-blue-600 text-lg">👤</span>
									</div>
									<h4 className="text-lg sm:text-xl font-bold text-gray-800">
										{language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
									</h4>
								</div>
								
								<div className="space-y-3 sm:space-y-4">
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
										<div className="flex justify-between items-center gap-3">
											<span className="font-semibold text-gray-700 flex items-center text-sm sm:text-base">
												<span className="mr-2">📝</span>
												{language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
											</span>
											<span className="text-gray-900 font-medium break-words text-sm sm:text-base">{registration.full_name}</span>
										</div>
									</div>
									
									<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-2xl border border-green-100 hover:shadow-md transition-shadow duration-200">
										<div className="flex justify-between items-center gap-3">
											<span className="font-semibold text-gray-700 flex items-center text-sm sm:text-base">
												<span className="mr-2">📧</span>
												{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
											</span>
											<span className="text-gray-900 font-medium break-words text-sm sm:text-base">{registration.email}</span>
										</div>
									</div>
									
									<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
										<div className="flex justify-between items-center gap-3">
											<span className="font-semibold text-gray-700 flex items-center text-sm sm:text-base">
												<span className="mr-2">📱</span>
												{language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}
											</span>
											<span className="text-gray-900 font-medium break-words text-sm sm:text-base">{registration.phone}</span>
										</div>
									</div>
									
									<div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 sm:p-4 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow duration-200">
										<div className="flex justify-between items-center gap-3">
											<span className="font-semibold text-gray-700 flex items-center text-sm sm:text-base">
												<span className="mr-2">🎂</span>
												{language === 'ar' ? 'العمر:' : 'Age:'}
											</span>
											<span className="text-gray-900 font-medium break-words text-sm sm:text-base">{registration.age}</span>
										</div>
									</div>
									
									<div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 sm:p-4 rounded-2xl border border-teal-100 hover:shadow-md transition-shadow duration-200">
										<div className="flex justify-between items-center gap-3">
											<span className="font-semibold text-gray-700 flex items-center text-sm sm:text-base">
												<span className="mr-2">📍</span>
												{language === 'ar' ? 'المدينة:' : 'City:'}
											</span>
											<span className="text-gray-900 font-medium break-words text-sm sm:text-base">{registration.city}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Professional Information */}
							<div className="space-y-4 sm:space-y-6">
								<div className="flex items-center space-x-3 rtl:space-x-reverse">
									<div className="bg-purple-100 p-2 rounded-lg">
										<span className="text-purple-600 text-lg">💼</span>
									</div>
									<h4 className="text-lg sm:text-xl font-bold text-gray-800">
										{language === 'ar' ? 'المعلومات المهنية' : 'Professional Information'}
									</h4>
								</div>
								
								<div className="space-y-3 sm:space-y-4">
									<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 sm:p-4 rounded-2xl border border-indigo-100 hover:shadow-md transition-shadow duration-200">
										<span className="font-semibold text-gray-700 flex items-center mb-2 sm:mb-3 text-sm sm:text-base">
											<span className="mr-2">🎓</span>
											{language === 'ar' ? 'الخلفية التعليمية:' : 'Educational Background:'}
										</span>
										<span className="text-gray-900 font-medium bg-white/50 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg inline-block break-words text-sm sm:text-base">
											{getBackgroundText(registration.background)}
										</span>
									</div>
									
									<div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 sm:p-4 rounded-2xl border border-pink-100 hover:shadow-md transition-shadow duration-200">
										<span className="font-semibold text-gray-700 flex items-center mb-2 sm:mb-3 text-sm sm:text-base">
											<span className="mr-2">⚡</span>
											{language === 'ar' ? 'المهارات:' : 'Skills:'}
										</span>
										<div className="flex flex-wrap gap-2">
											{registration.skills && registration.skills.map((skill, index) => (
												<span key={index} className="bg-white/50 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-900 border border-pink-200 break-words">
													{getSkillsText([skill])}
												</span>
											))}
										</div>
									</div>
									
									{registration.other_skills && (
										<div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow duration-200">
											<span className="font-semibold text-gray-700 flex items-center mb-2 sm:mb-3 text-sm sm:text-base">
												<img src="/images/star.png" alt="Star" className="mr-2 w-5 h-5 object-contain" />
												{language === 'ar' ? 'مهارات أخرى:' : 'Other Skills:'}
											</span>
											<p className="text-gray-900 font-medium bg-white/50 px-3 py-2 rounded-lg break-words text-sm sm:text-base">
												{registration.other_skills}
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Additional Information */}
						<div className="mt-6 sm:mt-8 space-y-6">
							{/* Rejection Reason */}
							{registration.status === 'rejected' && registration.rejection_reason && (
								<div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 sm:p-6 rounded-2xl border border-red-200 hover:shadow-md transition-shadow duration-200">
									<div className="flex items-center mb-3 sm:mb-4">
										<div className="bg-red-100 p-3 rounded-lg mr-3 sm:mr-4">
											<span className="text-red-600 text-lg sm:text-xl">❌</span>
										</div>
										<h4 className="text-lg sm:text-xl font-bold text-red-800">
											{language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
										</h4>
									</div>
									<p className="text-red-700 font-medium bg-white/50 px-4 py-3 rounded-lg break-words text-sm sm:text-base">
										{registration.rejection_reason}
									</p>
								</div>
							)}

							{/* Project Idea */}
							{registration.project_idea && (
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-2xl border border-blue-200 hover:shadow-md transition-shadow duration-200">
									<div className="flex items-center mb-3 sm:mb-4">
										<div className="bg-blue-100 p-3 rounded-lg mr-3 sm:mr-4">
											<span className="text-blue-600 text-lg sm:text-xl">💡</span>
										</div>
										<h4 className="text-lg sm:text-xl font-bold text-blue-800">
											{language === 'ar' ? 'فكرة المشروع' : 'Project Idea'}
										</h4>
									</div>
									<p className="text-blue-700 font-medium bg-white/50 px-4 py-3 rounded-lg break-words text-sm sm:text-base">
										{registration.project_idea}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

			{/* Status-specific messages */}
			{registration.status === 'pending' && (
				<div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div className="flex items-start space-x-3 sm:space-x-4 rtl:space-x-reverse">
						<div className="bg-yellow-100 p-3 sm:p-4 rounded-2xl">
							<span className="text-2xl sm:text-3xl animate-pulse">⏳</span>
						</div>
						<div className="flex-1">
							<h4 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-2 sm:mb-3">
								{language === 'ar' ? 'ما التالي؟' : 'What\'s Next?'}
							</h4>
							<p className="text-yellow-700 text-base sm:text-lg leading-relaxed">
								{language === 'ar' 
									? 'سيتم مراجعة طلبك خلال 2-3 أيام عمل. ستتلقى إشعاراً عبر البريد الإلكتروني عند اتخاذ القرار.'
									: 'Your application will be reviewed within 2-3 business days. You will receive an email notification when a decision is made.'
								}
							</p>
						</div>
					</div>
				</div>
			)}

			{registration.status === 'approved' && (
				<div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
					<div className="p-6 sm:p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
						<div className="flex items-start space-x-3 sm:space-x-4 rtl:space-x-reverse">
							<div className="bg-green-100 p-3 sm:p-4 rounded-2xl">
								<span className="text-2xl sm:text-3xl animate-bounce">🎉</span>
							</div>
							<div className="flex-1">
								<h4 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-3">
									{language === 'ar' ? 'مبروك!' : 'Congratulations!'}
								</h4>
								<p className="text-green-700 text-base sm:text-lg leading-relaxed">
									{language === 'ar' 
										? 'تم قبولك للمشاركة في الهاكثون. ستتلقى مزيداً من التفاصيل حول الحدث قريباً.'
										: 'You have been accepted to participate in the hackathon. You will receive more details about the event soon.'
									}
								</p>
							</div>
						</div>
					</div>

					{/* QR Code Section */}
					<div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
						<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3"></div>
						<div className="p-5 sm:p-8 lg:p-12">
							<div className="text-center mb-6 sm:mb-8">
								<div className="flex justify-center mb-3 sm:mb-4">
									<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
										<span className="text-2xl sm:text-3xl">📱</span>
									</div>
								</div>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
									{language === 'ar' ? 'QR Code للتسجيل' : 'Registration QR Code'}
								</h3>
								<p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
									{language === 'ar' 
										? 'احتفظ بهذا QR Code لتسهيل عملية التسجيل والدخول للحدث'
										: 'Keep this QR Code for easy registration and event access'
									}
								</p>
							</div>

							<div className="flex justify-center">
								<QRCodeDisplay 
									qrCode={registration.qr_code}
									registrationId={registration.id}
									type="hackathon"
									isCheckedIn={registration.is_checked_in}
									checkedInAt={registration.checked_in_at}
								/>
							</div>

					<div className="mt-6 sm:mt-8 text-center hidden sm:block">
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-2xl border border-blue-200">
									<h4 className="text-base sm:text-lg font-bold text-blue-800 mb-2 sm:mb-3">
										{language === 'ar' ? 'كيفية الاستخدام:' : 'How to Use:'}
									</h4>
									<div className="space-y-1.5 sm:space-y-2 text-blue-700">
										<p className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base">
											<span>1️⃣</span>
											<span>{language === 'ar' ? 'احفظ الصورة على هاتفك' : 'Save the image to your phone'}</span>
										</p>
										<p className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base">
											<span>2️⃣</span>
											<span>{language === 'ar' ? 'أظهرها عند وصولك للحدث' : 'Show it when you arrive at the event'}</span>
										</p>
										<p className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm sm:text-base">
											<span>3️⃣</span>
											<span>{language === 'ar' ? 'سيتم مسحها للتحقق من هويتك' : 'It will be scanned to verify your identity'}</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default HackathonStatus;
