import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import HackathonStatus from '../components/HackathonStatus';
import { submitHackathonRegistration, handleApiErrorWithToast } from '../utils/api';
import { showRegistrationSuccess, showFormLoading, showFormError, showValidationError } from '../utils/messageUtils';

const HackathonRegistration = () => {
	const { t, language } = useLanguage();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [existingRegistration, setExistingRegistration] = useState(null);
	const [loadingRegistration, setLoadingRegistration] = useState(true);
	const [prefillName, setPrefillName] = useState('');

	// Check for existing registration
	useEffect(() => {
		if (user) {
			fetchExistingRegistration();
		} else {
			setLoadingRegistration(false);
		}
	}, [user]);

	const fetchExistingRegistration = async () => {
		try {
			const response = await fetch('/api/user/registrations', {
				credentials: 'include'
			});
			const data = await response.json();
			
			if (data.success && data.data.hackathon) {
				setExistingRegistration(data.data.hackathon);
				setPrefillName(data.data.hackathon.full_name || '');
			} else if (data.success) {
				// Fallback to any other registration name or authenticated user's name
				const fallbackName = (data.data.workshops && data.data.workshops[0]?.full_name)
					|| data.data.conference?.full_name
					|| user?.name
					|| '';
				setPrefillName(fallbackName);
			}
		} catch (error) {
			console.error('Error fetching registration:', error);
		} finally {
			setLoadingRegistration(false);
		}
	};

	const handleEditRegistration = () => {
		// Navigate to edit form or show edit modal
		// For now, we'll just reset the existing registration to allow re-registration
		setExistingRegistration(null);
	};

	const fields = [
		{
			name: 'full_name',
			label: t('fullName'),
			type: 'text',
			required: true,
			placeholder: language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name',
			value: prefillName || user?.name || ''
		},
		{
			name: 'email',
			label: t('email'),
			type: 'email',
			required: true,
			readonly: true,
			placeholder: language === 'ar' ? 'example@email.com' : 'example@email.com',
			value: user?.email || ''
		},
		{
			name: 'phone',
			label: t('phone'),
			type: 'tel',
			required: true,
			countryCode: '+968',
			placeholder: language === 'ar' ? '12345678' : '12345678'
		},
		{
			name: 'age',
			label: t('age'),
			type: 'number',
			required: true,
			placeholder: language === 'ar' ? '25' : '25'
		},
		{
			name: 'city',
			label: language === 'ar' ? 'المحافظة / الولاية / المنطقة' : 'Governorate / State / Region',
			type: 'text',
			required: true,
			placeholder: language === 'ar' ? 'مسقط - بوشر' : 'Muscat - Bausher'
		},
		{
			name: 'background',
			label: t('background'),
			type: 'select',
			required: true,
			options: [
				{ value: 'computer_science', label: language === 'ar' ? 'علوم الحاسب' : 'Computer Science' },
				{ value: 'engineering', label: language === 'ar' ? 'الهندسة' : 'Engineering' },
				{ value: 'business', label: language === 'ar' ? 'إدارة الأعمال' : 'Business' },
				{ value: 'design', label: language === 'ar' ? 'التصميم' : 'Design' },
				{ value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
			]
		},
		{
			name: 'skills',
			label: t('skills'),
			type: 'checkbox-group',
			required: true,
			options: [
				{ value: 'programming', label: t('programming') },
				{ value: 'design', label: t('design') },
				{ value: 'data_analysis', label: t('dataAnalysis') },
				{ value: 'marketing', label: t('marketing') },
				{ value: 'project_management', label: t('projectManagement') },
				{ value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
			]
		},
		{
			name: 'other_skills',
			label: language === 'ar' ? 'المهارات الأخرى' : 'Other Skills',
			type: 'textarea',
			required: false,
			placeholder: language === 'ar' 
				? 'اكتب مهاراتك الأخرى هنا...' 
				: 'Write your other skills here...'
		}
	];

	const handleSubmit = async (formData) => {
		setIsLoading(true);

		try {
			const response = await submitHackathonRegistration(formData);
			if (response.success) {
				// Show success message
				showRegistrationSuccess('hackathon', 1, {
					position: 'top-center',
					duration: 5000
				});
				
				// Update the existing registration state
				setExistingRegistration(response.data);
				// Remember the name the user submitted
				if (response.data?.full_name) {
					setPrefillName(response.data.full_name);
				}
				// Don't navigate to success page, show the status instead
			} else {
				showFormError(response.message || t('registrationFailed'));
			}
		} catch (error) {
			console.error('Registration error:', error);
			
			// Use enhanced error handling
			handleApiErrorWithToast(error, () => {
				// Retry function
				handleSubmit(formData);
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 overflow-x-hidden">
			{/* Hero Section */}
			<div className="relative text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
				<div className="absolute inset-0 bg-black opacity-10"></div>
				
				{/* Animated Star Background Elements - Responsive */}
				<div className="absolute inset-0">
					<div className="star-floating absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-15 sm:opacity-20 animate-pulse"></div>
					<div className="star-floating absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-15 sm:opacity-20 animate-pulse delay-1000"></div>
					<div className="star-floating absolute top-1/2 left-1/6 sm:left-1/4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-15 sm:opacity-20 animate-pulse delay-500"></div>
					<div className="star-floating absolute top-1/3 right-1/4 sm:right-1/3 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-15 sm:opacity-20 animate-pulse delay-700"></div>
					<div className="star-floating absolute bottom-1/3 left-1/4 sm:left-1/3 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-15 sm:opacity-20 animate-pulse delay-300"></div>
				</div>
				
				<div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16 lg:py-20">
					<div className="text-center">
						<div className="flex justify-center mb-4 sm:mb-6">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
								<span className="text-3xl sm:text-4xl">🚀</span>
							</div>
						</div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2" style={{lineHeight: '1.1', paddingBottom: '0.5rem'}}>
							{language === 'ar' ? 'هاكاثون "ابتكر من الدقم"' : 'Hackathon "Innovate from Duqm"'}
						</h1>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto px-2" style={{color: '#F4A321'}}>
							{language === 'ar' 
								? 'منصة إبداعية تجمع المبرمجين والمصممين ورواد الأعمال لتطوير حلول حقيقية'
								: 'Creative platform bringing together programmers, designers and entrepreneurs to develop real solutions'
							}
						</p>
						<div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm px-2">
							<div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
								{language === 'ar' ? '4 ساعات من الإبداع' : '4 Hours of Innovation'}
							</div>
							<div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
								{language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}
							</div>
							<div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
								{language === 'ar' ? 'ذكاء اصطناعي' : 'AI Technology'}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="py-8 lg:py-12 xl:py-16">
				<div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
					{loadingRegistration ? (
						<div className="flex justify-center items-center py-12 lg:py-16">
							<div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-purple-600"></div>
							<span className="ml-3 text-sm lg:text-base text-gray-600">
								{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
							</span>
						</div>
					) : existingRegistration ? (
						<HackathonStatus 
							registration={existingRegistration} 
							onEdit={handleEditRegistration}
						/>
					) : (
						<div className="bg-white rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300">
							<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-2 lg:h-3"></div>
							<div className="p-4 lg:p-6 xl:p-8">
								<div className="text-center mb-4 lg:mb-6 xl:mb-8">
									<div className="flex justify-center mb-3 lg:mb-4">
										<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 lg:p-4 xl:p-5 rounded-xl lg:rounded-2xl shadow-lg">
											<span className="text-2xl lg:text-3xl xl:text-4xl">🚀</span>
										</div>
									</div>
									<h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 lg:mb-3 px-2">
										{language === 'ar' ? 'نموذج التسجيل في الهاكثون' : 'Hackathon Registration Form'}
									</h2>
									<p className="text-sm lg:text-base xl:text-lg text-gray-600 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-2">
										{language === 'ar' 
											? 'املأ النموذج أدناه للمشاركة في الهاكثون وابدأ رحلتك نحو الابتكار'
											: 'Fill out the form below to participate in the hackathon and start your innovation journey'
										}
									</p>
								</div>

								<Form
									onSubmit={handleSubmit}
									fields={fields}
									title=""
									submitText={t('submit')}
									isLoading={isLoading}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Info Section */}
			<div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-purple-50">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
					<div className="text-center mb-10 sm:mb-12 lg:mb-16">
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
							{language === 'ar' ? 'لماذا تشارك معنا؟' : 'Why Join Us?'}
						</h2>
						<p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
							{language === 'ar' 
								? 'انضم إلى مجتمع من المبدعين والمطورين لإنشاء حلول مبتكرة'
								: 'Join a community of creators and developers to build innovative solutions'
							}
						</p>
					</div>
					
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						<div className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 transition-transform duration-300">⏰</div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
								{language === 'ar' ? '4 ساعات مكثفة' : '4 Intensive Hours'}
							</h3>
							<p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
								{language === 'ar' 
									? 'وقت محدود لتحويل الأفكار إلى حلول عملية وابتكارية'
									: 'Limited time to transform ideas into practical and innovative solutions'
								}
							</p>
						</div>
						
						<div className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 transition-transform duration-300">🎯</div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
								{language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}
							</h3>
							<p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
								{language === 'ar' 
									? 'تحديات حقيقية في مجالات الطاقة والبيئة والنقل والاستدامة'
									: 'Real challenges in energy, environment, transport, and sustainability sectors'
								}
							</p>
						</div>
						
						<div className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 transition-transform duration-300">🤖</div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
								{language === 'ar' ? 'ذكاء اصطناعي' : 'AI Technology'}
							</h3>
							<p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
								{language === 'ar' 
									? 'استخدام أحدث تقنيات الذكاء الاصطناعي في تطوير الحلول'
									: 'Using cutting-edge artificial intelligence technologies in solution development'
								}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HackathonRegistration;
