import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Form = ({ onSubmit, fields, title, submitText, isLoading = false }) => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Initialize form data with field values
    React.useEffect(() => {
        const initialData = {};
        fields.forEach(field => {
            if (field.value !== undefined) {
                initialData[field.name] = field.value;
            }
        });
        setFormData(initialData);
    }, [fields]);

    // Update form data when field values change
    React.useEffect(() => {
        const updatedData = { ...formData };
        let hasChanges = false;
        
        fields.forEach(field => {
            if (field.value !== undefined && JSON.stringify(field.value) !== JSON.stringify(formData[field.name])) {
                updatedData[field.name] = field.value;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            console.log('Updating form data from field values:', updatedData);
            setFormData(updatedData);
        }
    }, [fields]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log('Form handleChange:', { name, value, type, checked, formData: formData[name] });
        
        if (type === 'checkbox') {
            const currentValues = formData[name] || [];
            const newValues = checked 
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
            
            console.log('Checkbox change:', { currentValues, newValues, checked });
            
            // Update form data first
            setFormData(prev => {
                const updated = { ...prev, [name]: newValues };
                console.log('Updated formData:', updated);
                return updated;
            });
            
            // Then call custom onChange if exists
            const field = fields.find(f => f.name === name);
            if (field && field.onChange) {
                console.log('Calling custom onChange:', newValues);
                field.onChange(newValues);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            
            // Call custom onChange if exists
            const field = fields.find(f => f.name === name);
            if (field && field.onChange) {
                field.onChange(value);
            }
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        fields.forEach(field => {
            if (field.required && (!formData[field.name] || formData[field.name].length === 0)) {
                newErrors[field.name] = t('required');
            }
            
            if (field.type === 'email' && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
                newErrors[field.name] = t('invalidEmail');
            }
            
            if (field.type === 'tel' && formData[field.name]) {
                // For Omani phone numbers with fixed +968 prefix
                if (field.countryCode === '+968') {
                    if (!/^[0-9]{8}$/.test(formData[field.name])) {
                        newErrors[field.name] = language === 'ar' ? 'يجب أن يكون رقم الهاتف 8 أرقام' : 'Phone number must be 8 digits';
                    }
                } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData[field.name])) {
                    newErrors[field.name] = t('invalidPhone');
                }
            }
            
            if (field.name === 'age') {
                const age = parseInt(formData[field.name]);
                if (age < 16) newErrors[field.name] = t('minAge');
                if (age > 100) newErrors[field.name] = t('maxAge');
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const renderField = (field) => {
        const commonClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            errors[field.name] ? 'border-red-500' : 'border-gray-300'
        } ${field.readonly ? 'bg-gray-100 cursor-not-allowed' : ''}`;
        
        const labelClasses = `block text-sm font-medium text-gray-700 mb-2 ${
            language === 'ar' ? 'text-right' : 'text-left'
        }`;

        switch (field.type) {
            case 'select':
                return (
                    <div key={field.name} className="mb-6">
                        <label className={labelClasses}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className={commonClasses}
                            required={field.required}
                            disabled={field.readonly}
                        >
                            <option value="">{language === 'ar' ? 'اختر...' : 'Select...'}</option>
                            {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                );

            case 'checkbox-group':
                return (
                    <div key={field.name} className="mb-6">
                        <label className={labelClasses}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {field.options.map(option => {
                                const currentValues = formData[field.name] || [];
                                const isChecked = currentValues.includes(option.value);
                                console.log(`Checkbox ${option.value}:`, { 
                                    isChecked, 
                                    currentValues, 
                                    fieldName: field.name,
                                    formData: formData[field.name]
                                });
                                return (
                                    <label key={option.value} className={`flex items-center space-x-3 rtl:space-x-reverse p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                    isChecked ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                                }`}>
                                        <input
                                            type="checkbox"
                                            name={field.name}
                                            value={option.value}
                                            checked={isChecked}
                                            onChange={handleChange}
                                            onClick={(e) => {
                                                console.log('Checkbox clicked:', option.value, 'checked:', !isChecked);
                                                // Don't prevent default - let the checkbox work normally
                                                // The onChange handler will take care of the state
                                            }}
                                            onMouseDown={(e) => {
                                                console.log('Checkbox mouse down:', option.value);
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                                            style={{ pointerEvents: 'auto' }}
                                            key={`${field.name}-${option.value}`}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.name} className="mb-6">
                        <label className={labelClasses}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            rows={4}
                            className={commonClasses}
                            placeholder={field.placeholder}
                            required={field.required}
                            readOnly={field.readonly}
                        />
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                );

            case 'tel':
                return (
                    <div key={field.name} className="mb-6">
                        <label className={labelClasses}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.countryCode ? (
                            <div className="flex" dir="ltr">
                                <div className="flex items-center px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-medium whitespace-nowrap">
                                    {field.countryCode}
                                </div>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className={`${commonClasses} rounded-l-none`}
                                    required={field.required}
                                    readOnly={field.readonly}
                                    maxLength={8}
                                    dir="ltr"
                                />
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className={commonClasses}
                                required={field.required}
                                readOnly={field.readonly}
                            />
                        )}
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                );

            default:
                return (
                    <div key={field.name} className="mb-6">
                        <label className={labelClasses}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={commonClasses}
                            required={field.required}
                            readOnly={field.readonly}
                        />
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    {title}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {fields.map(renderField)}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                            </div>
                        ) : (
                            submitText
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Form;
