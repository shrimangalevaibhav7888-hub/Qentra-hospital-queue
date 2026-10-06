import React, { useState } from 'react';
import { Mail, Phone, Building, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    hospital: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', hospital: '', email: '', phone: '', message: '' });
    }, 800);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>HOSPITAL ONBOARDING</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Ready to modernize your hospital queue?
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Connect with our hospital deployment team for tailored OPD integration, multi-department screen setup, or live hackathon demonstrations.
            </p>

            <div className="space-y-4 pt-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Email Support</div>
                  <div className="font-bold text-slate-900">deployments@qentra.app</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Hospital Hotline</div>
                  <div className="font-bold text-slate-900">+91 (022) 4890-7700</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out. A Qentra healthcare systems engineer will contact your clinic within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Hospital Inquiry</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Anand Deshmukh"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Hospital / Clinic</label>
                      <input
                        type="text"
                        required
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                        placeholder="Apollo Multispecialty OPD"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Official Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@hospital.org"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Inquiry Message</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="We have 6 OPD consultation rooms and want to pilot Qentra's dynamic queue system..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
