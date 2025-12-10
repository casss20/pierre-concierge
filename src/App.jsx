import React, { useState, useEffect } from 'react';
import {
    Heart,
    Stethoscope,
    Calendar,
    Clock,
    CheckCircle,
    Phone,
    Mail,
    MapPin,
    Menu,
    X,
    Syringe,
    Activity,
    ShieldAlert,
    Star,
    ChevronRight,
    ArrowRight,
    Award,
    BookOpen,
    HelpCircle,
    Briefcase
} from 'lucide-react';

// --- Reusable UI Components ---

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const baseStyle = "px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md inline-flex items-center justify-center";
    const variants = {
        primary: "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg",
        secondary: "bg-white text-blue-900 border-2 border-blue-900 hover:bg-blue-50",
        accent: "bg-teal-600 text-white hover:bg-teal-700",
        outline: "border-2 border-white text-white hover:bg-white/10"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const SectionHeading = ({ title, subtitle, centered = true }) => (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">{title}</h2>
        <div className={`h-1 w-24 bg-teal-500 rounded ${centered ? 'mx-auto' : ''}`}></div>
        {subtitle && <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
);

const ServiceCard = ({ icon: Icon, title, description, price, onBook }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col h-full">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            <Icon className="w-8 h-8 text-blue-900" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed flex-grow">{description}</p>
        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
            <div className="text-teal-600 font-semibold">{price}</div>
            <button onClick={onBook} className="text-blue-900 text-sm font-bold hover:text-teal-600 flex items-center">
                Book <ChevronRight size={16} className="ml-1" />
            </button>
        </div>
    </div>
);

// --- Page Components ---

const HomePage = ({ navigateTo, openBooking }) => {
    const [activeTab, setActiveTab] = useState('subscription');

    return (
        <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <header className="relative min-h-[90vh] flex items-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="Gemini_Generated_Image_vzbkpcvzbkpcvzbk (1).jpg"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" }}
                        alt="Elda Marie Pierre RN in White Coat"
                        className="w-full h-full object-cover object-top opacity-20 md:opacity-100 md:w-1/2 md:ml-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/95 to-transparent md:via-blue-50/70"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="md:w-1/2 pt-12 md:pt-0">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold mb-6">
                            <Star className="w-4 h-4 mr-1 fill-current" /> Premier Concierge Nursing in Ocala
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                            Hospital-Grade Care, <br />
                            <span className="text-blue-900">Right at Home.</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                            Expert post-operative support, IV therapy, and wound care by Elda Marie Pierre, RN, BSN. Skip the waiting room and recover in comfort.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => navigateTo('pricing')} variant="primary">
                                View Plans
                            </Button>
                            <Button onClick={() => navigateTo('services')} variant="secondary">
                                Our Services
                            </Button>
                            <Button onClick={() => navigateTo('about')} variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 md:border-2 md:border-blue-900/20">
                                Meet Elda
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center space-x-8 text-gray-500 text-sm font-medium">
                            <div className="flex items-center"><CheckCircle className="w-5 h-5 text-teal-500 mr-2" /> Licensed RN</div>
                            <div className="flex items-center"><CheckCircle className="w-5 h-5 text-teal-500 mr-2" /> Insured</div>
                            <div className="flex items-center"><CheckCircle className="w-5 h-5 text-teal-500 mr-2" /> Bilingual</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mini Features Teaser */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-teal-600 font-bold uppercase tracking-wide mb-2">Why Choose Us</p>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">Care That Revolves Around You</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Clock, title: "Unrushed Visits", desc: "We take the time to listen, assess, and explain everything clearly. No 15-minute rush." },
                            { icon: Calendar, title: "Flexible Scheduling", desc: "Morning, evening, and weekend appointments available to fit your lifestyle." },
                            { icon: MapPin, title: "We Come to You", desc: "Service available throughout Ocala, Silver Springs, and Marion County homes & hotels." }
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                <item.icon className="w-10 h-10 text-blue-900 mx-auto mb-4" />
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section on Home */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="Comprehensive Nursing Services"
                        subtitle="Professional medical care tailored to your specific recovery and wellness needs."
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={Syringe}
                            title="IV Therapy & Hydration"
                            description="Administration of prescribed fluids and medications in the comfort of your home. Perfect for dehydration, recovery, or vitamin boosts."
                            price="Starting at $200"
                            onBook={() => openBooking('IV Therapy')}
                        />
                        <ServiceCard
                            icon={ShieldAlert}
                            title="Advanced Wound Care"
                            description="Expert management of surgical wounds, pressure ulcers, and diabetic wounds. Includes sterile dressing changes and infection monitoring."
                            price="Starting at $175"
                            onBook={() => openBooking('Wound Care')}
                        />
                        <ServiceCard
                            icon={Activity}
                            title="Post-Operative Recovery"
                            description="Peace of mind after surgery. Vitals monitoring, pain management assessment, medication reconciliation, and mobility assistance."
                            price="$160 per visit"
                            onBook={() => openBooking('Post-Op Care')}
                        />
                        <ServiceCard
                            icon={Heart}
                            title="Chronic Disease Mgmt"
                            description="Ongoing support for diabetes, hypertension, and heart conditions. We help you stay on track with education and regular check-ins."
                            price="Custom Plans"
                            onBook={() => openBooking('Chronic Disease Mgmt')}
                        />
                        <ServiceCard
                            icon={Stethoscope}
                            title="Wellness Assessments"
                            description="A full head-to-toe physical assessment including blood pressure, heart rate, oxygen levels, and lung sounds."
                            price="$150 per visit"
                            onBook={() => openBooking('Wellness Assessment')}
                        />
                        <ServiceCard
                            icon={Briefcase}
                            title="Patient Advocacy"
                            description="Need help understanding doctor's orders? We attend appointments with you or help organize your medical life."
                            price="Hourly Rates"
                            onBook={() => openBooking('Patient Advocacy')}
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section on Home */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Simple, Transparent Pricing" subtitle="Choose a single visit for immediate needs, or save with our monthly subscription plan designed for consistent care." />

                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-100 p-1 rounded-full inline-flex">
                            <button
                                onClick={() => setActiveTab('subscription')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'subscription' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Monthly Subscription
                            </button>
                            <button
                                onClick={() => setActiveTab('alacarte')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'alacarte' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Single Visits
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        {activeTab === 'subscription' ? (
                            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-100 transform transition-all hover:scale-105">
                                <div className="bg-teal-500 p-3 text-center text-white font-bold text-sm tracking-wider uppercase">Most Popular Choice</div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-center mb-2">The Pierre Care Plan</h3>
                                    <div className="text-center mb-6">
                                        <span className="text-5xl font-bold text-blue-900">$450</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-gray-600 text-center mb-8 text-sm">Ideal for post-op recovery or ongoing chronic care management.</p>

                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                            <span><strong>3 Visits Per Month</strong> included</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                            <span><strong>Mix & Match Services</strong> (Wound Care, IV, Check-ups)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                            <span>Priority Scheduling (Weekends/Mornings)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                            <span>24/7 Text Support Line</span>
                                        </li>
                                    </ul>

                                    <Button onClick={() => openBooking('Pierre Care Subscription')} variant="primary" className="w-full py-4 text-lg bg-blue-900 hover:bg-blue-800">
                                        Start Subscription
                                    </Button>
                                    <p className="text-xs text-center text-gray-400 mt-4">No long-term contract. Cancel anytime.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
                                {[
                                    { name: "Wound Care Visit", price: "$175", desc: "Sterile dressing change, measurement & assessment." },
                                    { name: "IV Hydration", price: "$200+", desc: "Fluids & meds administration (requires prescription)." },
                                    { name: "Wellness Check", price: "$150", desc: "Complete physical assessment (Heart, Lungs, Vitals)." },
                                    { name: "Post-Op Check-in", price: "$160", desc: "Incision check, pain assessment & medication review." }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-xl text-gray-900">{item.name}</h4>
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{item.price}</span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{item.desc}</p>
                                        <button onClick={() => openBooking(item.name)} className="text-teal-600 font-bold text-sm hover:text-teal-800 flex items-center">
                                            Book Single Visit <ChevronRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA / Contact Section on Home */}
            <section className="py-20 bg-teal-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <SectionHeading title="Ready to prioritize your health?" subtitle="Whether you need a one-time check-up or continuous care, I am ready to assist you. Booking is simple and secure." />

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <div className="bg-white px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
                            <Phone className="w-10 h-10 text-teal-600 mr-4" />
                            <div className="text-left">
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Call or Text</div>
                                <a href="tel:+17543676929" className="text-2xl font-bold text-blue-900 hover:text-blue-700">+1-754-367-6929</a>
                            </div>
                        </div>
                        <div className="bg-white px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
                            <Mail className="w-10 h-10 text-teal-600 mr-4" />
                            <div className="text-left">
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email Me</div>
                                <a href="mailto:jpjojo565@gmail.com" className="text-xl font-bold text-blue-900 hover:text-blue-700">jpjojo565@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AboutPage = () => (
    <div className="pt-24 pb-20 bg-white animate-in slide-in-from-right duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="About Pierre Concierge Nursing" subtitle="Professional, personal, and dedicated to your recovery." />

            <div className="flex flex-col md:flex-row items-start gap-12 mb-20">
                <div className="md:w-1/2 relative sticky top-24">
                    {/* IMAGE NOTE: Using the scrubs image filename provided by user. */}
                    <div className="absolute top-4 -left-4 w-full h-full bg-blue-100 rounded-2xl transform -rotate-2"></div>
                    <img
                        src="Gemini_Generated_Image_yca050yca050yca0.jpg"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" }}
                        alt="Elda Marie Pierre in Scrubs"
                        className="relative rounded-2xl shadow-xl w-full object-cover z-10 aspect-[4/5]"
                    />
                </div>

                <div className="md:w-1/2">
                    <h2 className="text-teal-600 font-bold tracking-wide uppercase text-sm mb-2">My Story</h2>
                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">Elda Marie Joe Pierre, RN, BSN</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed text-lg font-medium">
                        "I believe that healing happens best where you are most comfortable—at home. But you shouldn't have to compromise on clinical safety to get there."
                    </p>
                    <div className="prose text-gray-600 mb-8">
                        <p className="mb-4">
                            I am a Registered Nurse with a Bachelor of Science in Nursing (BSN) and over a decade of hands-on experience in the medical field. My career has taken me from the fast-paced environment of rehabilitation centers to the personal setting of home health care.
                        </p>
                        <p>
                            I founded <strong>Pierre Concierge Nursing</strong> because I saw a gap in the healthcare system. Too often, patients are discharged home with confusing instructions and limited support. My goal is to be your advocate, your nurse, and your peace of mind.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2" /> Professional Experience</h4>
                        <div className="space-y-4">
                            <div className="border-l-2 border-teal-500 pl-4">
                                <div className="font-bold text-gray-900">Registered Nurse</div>
                                <div className="text-sm text-gray-500">The Lodge Rehabilitation / HCA West Marion • 2022-Present</div>
                                <p className="text-sm text-gray-600 mt-1">High-quality post-operative care, medication administration, and patient education.</p>
                            </div>
                            <div className="border-l-2 border-gray-300 pl-4">
                                <div className="font-bold text-gray-900">Home Health Specialist</div>
                                <div className="text-sm text-gray-500">Trend Home Health Services • 2022-Present</div>
                                <p className="text-sm text-gray-600 mt-1">Specialized in-home care, vital monitoring, and personalized care plans.</p>
                            </div>
                            <div className="border-l-2 border-gray-300 pl-4">
                                <div className="font-bold text-gray-900">Certified Nursing Assistant</div>
                                <div className="text-sm text-gray-500">Nurse Care Inc & Synergy Health • 2000-2021</div>
                                <p className="text-sm text-gray-600 mt-1">Decades of foundational patient care experience.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2" /> Education & Certifications</h4>
                        <ul className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                            <li className="flex items-center"><Award className="w-4 h-4 text-teal-500 mr-2" /> Bachelor of Science in Nursing (BSN), Grand Canyon University</li>
                            <li className="flex items-center"><Award className="w-4 h-4 text-teal-500 mr-2" /> Associate Degree in Nursing (ADN), Hosanna College</li>
                            <li className="flex items-center"><Award className="w-4 h-4 text-teal-500 mr-2" /> Licensed Registered Nurse (Florida)</li>
                            <li className="flex items-center"><Award className="w-4 h-4 text-teal-500 mr-2" /> CPR & First Aid Certified</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ServicesPage = ({ openBooking }) => (
    <div className="pt-24 pb-20 bg-gray-50 animate-in slide-in-from-right duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
                title="Our Medical Services"
                subtitle="We bring the clinic to your living room. Professional, sterile, and compassionate care."
            />

            {/* Main Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                <ServiceCard
                    icon={Syringe}
                    title="IV Therapy & Hydration"
                    description="Administration of prescribed fluids and medications. Perfect for dehydration, post-viral recovery, or vitamin boosts. We handle the setup, administration, and monitoring."
                    price="Starting at $200"
                    onBook={() => openBooking('IV Therapy')}
                />
                <ServiceCard
                    icon={ShieldAlert}
                    title="Advanced Wound Care"
                    description="Expert management of surgical wounds, pressure ulcers, and diabetic wounds. We ensure proper healing, change dressings sterilely, and monitor for any signs of infection."
                    price="Starting at $175"
                    onBook={() => openBooking('Wound Care')}
                />
                <ServiceCard
                    icon={Activity}
                    title="Post-Operative Recovery"
                    description="Peace of mind after surgery. We provide vitals monitoring, pain management assessment, medication reconciliation, and assistance with safe mobility and transfers."
                    price="$160 per visit"
                    onBook={() => openBooking('Post-Op Care')}
                />
                <ServiceCard
                    icon={Heart}
                    title="Chronic Disease Mgmt"
                    description="Ongoing support for diabetes, hypertension, and heart conditions. We help you stay on track with education, diet review, and regular health check-ins to prevent hospitalization."
                    price="Custom Plans"
                    onBook={() => openBooking('Chronic Disease Mgmt')}
                />
                <ServiceCard
                    icon={Stethoscope}
                    title="Wellness Assessments"
                    description="A full head-to-toe physical assessment including blood pressure, heart rate, oxygen levels, and lung sounds. Great for peace of mind or sending updates to family members."
                    price="$150 per visit"
                    onBook={() => openBooking('Wellness Assessment')}
                />
                <ServiceCard
                    icon={Briefcase}
                    title="Patient Advocacy"
                    description="Need help understanding doctor's orders? We attend appointments with you or help organize your medical life. We act as the bridge between you and your specialist."
                    price="Hourly Rates"
                    onBook={() => openBooking('Patient Advocacy')}
                />
            </div>

            {/* How It Works Section */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-serif font-bold text-gray-900">How It Works</h3>
                    <p className="text-gray-600">Simple steps to getting the care you need.</p>
                </div>
                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { step: "01", title: "Book Online", desc: "Select your service or subscription plan through our secure portal." },
                        { step: "02", title: "Intake Call", desc: "We briefly discuss your medical needs and verify physician orders if needed." },
                        { step: "03", title: "Home Visit", desc: "Elda arrives at your home fully equipped to provide care." },
                        { step: "04", title: "Recovery", desc: "We document everything and send updates to your doctor or family." }
                    ].map((item, i) => (
                        <div key={i} className="text-center relative">
                            <div className="text-5xl font-bold text-gray-100 mb-4 font-serif">{item.step}</div>
                            <h4 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const PricingPage = ({ openBooking }) => {
    const [activeTab, setActiveTab] = useState('subscription');

    return (
        <div className="pt-24 pb-20 bg-white animate-in slide-in-from-right duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading title="Transparent Pricing" subtitle="Invest in your health with flexible options. No hidden fees." />

                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 p-1 rounded-full inline-flex">
                        <button
                            onClick={() => setActiveTab('subscription')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'subscription' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Monthly Subscription
                        </button>
                        <button
                            onClick={() => setActiveTab('alacarte')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'alacarte' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Single Visits
                        </button>
                    </div>
                </div>

                <div className="flex justify-center mb-20">
                    {activeTab === 'subscription' ? (
                        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-100 transform transition-all hover:scale-105">
                            <div className="bg-teal-500 p-3 text-center text-white font-bold text-sm tracking-wider uppercase">Best Value for Post-Op</div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-center mb-2">The Pierre Care Plan</h3>
                                <div className="text-center mb-6">
                                    <span className="text-5xl font-bold text-blue-900">$450</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                                <p className="text-gray-600 text-center mb-8 text-sm">Ideal for post-op recovery or ongoing chronic care management. Ensures you have a nurse on call.</p>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span><strong>3 Visits Per Month</strong> included</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span><strong>Mix & Match Services</strong> (Wound Care, IV, Check-ups)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Priority Scheduling (Weekends/Mornings)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Direct Text Access to Elda</span>
                                    </li>
                                </ul>

                                <Button onClick={() => openBooking('Pierre Care Subscription')} variant="primary" className="w-full py-4 text-lg bg-blue-900 hover:bg-blue-800">
                                    Select Plan
                                </Button>
                                <p className="text-xs text-center text-gray-400 mt-4">No long-term contract. Cancel anytime.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
                            {[
                                { name: "Wound Care Visit", price: "$175", desc: "Sterile dressing change, measurement & assessment." },
                                { name: "IV Hydration", price: "$200+", desc: "Fluids & meds administration (requires prescription)." },
                                { name: "Wellness Check", price: "$150", desc: "Complete physical assessment (Heart, Lungs, Vitals)." },
                                { name: "Post-Op Check-in", price: "$160", desc: "Incision check, pain assessment & medication review." }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-blue-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-xl text-gray-900">{item.name}</h4>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{item.price}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{item.desc}</p>
                                    <button onClick={() => openBooking(item.name)} className="text-teal-600 font-bold text-sm hover:text-teal-800 flex items-center">
                                        Book Single Visit <ChevronRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-blue-900 flex items-center mb-2"><HelpCircle className="w-5 h-5 mr-2" /> Do you accept insurance?</h4>
                            <p className="text-gray-700">We are a private pay (concierge) service, which allows us to provide higher quality, unrushed care without insurance restrictions. However, we can provide a detailed "Superbill" for you to submit to your insurance for potential out-of-network reimbursement.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-blue-900 flex items-center mb-2"><HelpCircle className="w-5 h-5 mr-2" /> What forms of payment do you accept?</h4>
                            <p className="text-gray-700">We accept all major credit cards, HSA/FSA cards, and Zelle. Payment is due at the time of booking to secure your appointment.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-blue-900 flex items-center mb-2"><HelpCircle className="w-5 h-5 mr-2" /> Can you prescribe medication?</h4>
                            <p className="text-gray-700">As a Registered Nurse, I administer medications prescribed by your doctor. I cannot write new prescriptions, but I work closely with your physician to ensure you get what you need.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactPage = () => (
    <div className="pt-24 pb-20 bg-teal-50 animate-in slide-in-from-right duration-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <SectionHeading title="Get in Touch" subtitle="We are here to answer your questions and schedule your care." />

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <Phone className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2">Call or Text</h3>
                    <p className="text-gray-600 mb-4">Immediate response for scheduling and inquiries.</p>
                    <a href="tel:+17543676929" className="text-2xl font-bold text-blue-900 hover:text-blue-700">+1-754-367-6929</a>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <Mail className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-4">Send us your documents or detailed questions.</p>
                    <a href="mailto:jpjojo565@gmail.com" className="text-xl font-bold text-blue-900 hover:text-blue-700">jpjojo565@gmail.com</a>
                </div>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-2xl text-left shadow-xl">
                <div className="flex items-start">
                    <MapPin className="w-8 h-8 text-teal-400 mr-4 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-xl mb-2">Serving Ocala & Marion County</h3>
                        <p className="text-blue-200">We provide mobile nursing services to private residences, hotels, and assisted living facilities throughout:</p>
                        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm font-medium">
                            <li>• Ocala</li>
                            <li>• Silver Springs Shores</li>
                            <li>• Belleview</li>
                            <li>• The Villages (North)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Application ---

export default function PierreConciergeNursing() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    // Handle scroll for navbar styling
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const openBooking = (serviceName) => {
        setSelectedService(serviceName);
        setBookingModalOpen(true);
    };

    const navigateTo = (page) => {
        setCurrentPage(page);
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', value: 'home' },
        { name: 'About', value: 'about' },
        { name: 'Services', value: 'services' },
        { name: 'Pricing', value: 'pricing' },
        { name: 'Contact', value: 'contact' },
    ];

    const renderContent = () => {
        switch (currentPage) {
            case 'home': return <HomePage navigateTo={navigateTo} openBooking={openBooking} />;
            case 'about': return <AboutPage />;
            case 'services': return <ServicesPage openBooking={openBooking} />;
            case 'pricing': return <PricingPage openBooking={openBooking} />;
            case 'contact': return <ContactPage />;
            default: return <HomePage navigateTo={navigateTo} openBooking={openBooking} />;
        }
    };

    return (
        <div className="font-sans text-gray-800 antialiased bg-gray-50 min-h-screen flex flex-col">

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || currentPage !== 'home' ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <button onClick={() => navigateTo('home')} className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl group-hover:bg-blue-800 transition-colors">P</div>
                        <span className={`text-xl font-bold font-serif tracking-tight ${scrolled || currentPage !== 'home' ? 'text-gray-900' : 'text-blue-900 bg-white/80 px-2 rounded'}`}>
                            Pierre Concierge Nursing
                        </span>
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => navigateTo(link.value)}
                                className={`font-medium hover:text-teal-600 transition-colors ${currentPage === link.value
                                        ? 'text-teal-600 font-bold'
                                        : (scrolled || currentPage !== 'home' ? 'text-gray-600' : 'text-gray-800 bg-white/80 px-2 rounded')
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <Button onClick={() => openBooking('General Consultation')} variant="primary" className="py-2 px-5 text-sm h-10">
                            Book Now
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-gray-800 p-2 bg-white/80 rounded-md">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t z-50">
                        <div className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => navigateTo(link.value)}
                                    className={`text-left font-medium py-2 border-b border-gray-100 ${currentPage === link.value ? 'text-teal-600' : 'text-gray-800'}`}
                                >
                                    {link.name}
                                </button>
                            ))}
                            <Button onClick={() => { openBooking('General Consultation'); setIsMenuOpen(false); }} className="w-full">
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow">
                {renderContent()}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-white text-xl font-serif font-bold mb-4">Pierre Concierge Nursing</h3>
                            <p className="text-sm leading-relaxed mb-4">
                                Providing hospital-grade nursing care in the comfort and privacy of your home. Dedicated to compassion, integrity, and clinical excellence.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Navigation</h4>
                            <ul className="space-y-2 text-sm">
                                {navLinks.map(link => (
                                    <li key={link.name}>
                                        <button onClick={() => navigateTo(link.value)} className="hover:text-teal-400 transition-colors">
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center"><Phone size={16} className="mr-2 text-teal-500" /> +1-754-367-6929</li>
                                <li className="flex items-center"><Mail size={16} className="mr-2 text-teal-500" /> jpjojo565@gmail.com</li>
                                <li className="flex items-center"><Clock size={16} className="mr-2 text-teal-500" /> Mon-Sat: 8am - 6pm</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Pierre Concierge Nursing & Wellness. All rights reserved.</p>
                        <p className="mt-2">Disclaimer: Services provided are non-emergency. In case of a medical emergency, please dial 911.</p>
                    </div>
                </div>
            </footer>

            {/* Booking Modal */}
            {bookingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setBookingModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-6">
                            <Calendar className="w-12 h-12 text-blue-900 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-gray-900">Request Appointment</h3>
                            <p className="text-gray-500">You are interested in: <span className="text-teal-600 font-semibold">{selectedService}</span></p>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thank you! Since this is a demo, no email was sent, but in a real version, this would alert Elda.");
                            setBookingModalOpen(false);
                        }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="(555) 123-4567" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date/Time</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Monday Morning" />
                            </div>

                            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                                Send Request
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Elda will contact you shortly to confirm details and pricing.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Icon component needed for services
function UserCheck(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    );
}
