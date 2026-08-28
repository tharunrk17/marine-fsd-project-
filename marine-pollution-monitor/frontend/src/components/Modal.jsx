import { X } from 'lucide-react';
export default function Modal({ title, children, onClose }) { return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>{title}</h2><p>Enter the observation details below.</p></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}</div></div>; }
