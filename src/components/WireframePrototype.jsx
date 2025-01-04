import React, { useState } from 'react';
import { ChevronRight, Settings, Calendar, Bell, Clock, WashingMachine, User, Lock, ChevronLeft } from 'lucide-react';

interface NavButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick: () => void;
}

const WireframePrototype = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [breadcrumbs, setBreadcrumbs] = useState(['Login']);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getParentPage = (currentBreadcrumbs) => {
    const navigationMap = {
      'Home': 'main',
      'Own Bookings': 'main',
      'Booking Interface': 'main',
      'Machine Status': 'main',
      'Notifications': 'main',
      'Settings': 'main',
      'Current Bookings': 'ownBookings',
      'Modify Bookings': 'ownBookings',
      'Cancel Bookings': 'ownBookings',
      'Book Slots': 'bookingInterface',
      'Modify Time': 'modifyBookings',
      'Modify Program': 'modifyBookings',
      'Modify Slot Type': 'modifyBookings',
      'Machine Overview': 'machineStatus',
      'Email / App Settings': 'notifications',
      'Notification Conditions': 'notifications',
      'Language Settings': 'settings'
    };

    const currentBreadcrumb = currentBreadcrumbs[currentBreadcrumbs.length - 1];
    return navigationMap[currentBreadcrumb] || 'main';
  };

  const navigateTo = (page, breadcrumb) => {
    setCurrentPage(page);
    setBreadcrumbs(prev => {
      const index = prev.indexOf(breadcrumb);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      }
      return [...prev, breadcrumb];
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push({
        time: `${hour}:00`,
        available: Math.random() > 0.5,
      });
    }
    return slots;
  };

  const CalendarView = ({ onSlotClick }) => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium p-2">{day}</div>
          ))}
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          {[...Array(daysInMonth)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onSlotClick(i + 1)}
              className="p-2 text-center hover:bg-gray-100 rounded"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const TimeSlotView = () => {
    const slots = generateTimeSlots();
    return (
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold mb-2">Available Time Slots</h3>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot, index) => (
            <button
              key={index}
              className={`p-2 rounded ${slot.available ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100'}`}
              disabled={!slot.available}
            >
              {slot.time} - {slot.available ? 'Available' : 'Booked'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBookingPages = () => {
    switch (currentPage) {
      case 'bookSlots':
        return (
          <div className="space-y-4">
            <div className="mb-4 space-y-2">
              <button className="w-full p-2 bg-blue-100 rounded-lg hover:bg-blue-200">
                Select Fixed Slot
              </button>
              <button className="w-full p-2 bg-blue-100 rounded-lg hover:bg-blue-200">
                Select Optional Slot
              </button>
            </div>
            <CalendarView onSlotClick={() => {}} />
            <TimeSlotView />
            <div className="space-y-2 mt-4">
              <select className="w-full p-2 border rounded-lg">
                <option>Select Machine</option>
                <option>Machine 1</option>
                <option>Machine 2</option>
              </select>
              <select className="w-full p-2 border rounded-lg">
                <option>Select Program</option>
                <option>Quick Wash (30 min)</option>
                <option>Normal Wash (60 min)</option>
                <option>Heavy Duty (90 min)</option>
              </select>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Confirm Booking
              </button>
            </div>
          </div>
        );

      case 'modifyTime':
      case 'modifyProgram':
      case 'modifySlotType':
        return (
          <div className="space-y-4">
            <CalendarView onSlotClick={() => {}} />
            <TimeSlotView />
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Selected Booking</h3>
              <p className="text-sm text-gray-600">Machine 1 - Normal Wash</p>
              <p className="text-sm text-gray-600">Duration: 60 minutes</p>
              <div className="mt-2 space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save Changes
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const LoginScreen = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome to LaundryBook</h1>
        <p className="text-gray-500">Please login to continue</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button
          onClick={() => navigateTo('main', 'Home')}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );

  const NavButton = ({ icon, text, onClick }) => (
    <button
      onClick={onClick}
      className="w-full p-4 flex items-center justify-between bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{text}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );

  const renderPage = () => {
    const bookingContent = renderBookingPages();
    if (bookingContent) return bookingContent;

    // Original switch statement continues...
    switch (currentPage) {
      case 'login':
        return <LoginScreen />;
      
      case 'main':
        return (
          <div className="space-y-4">
            <NavButton 
              icon={<Calendar className="w-5 h-5" />}
              text="Own Bookings"
              onClick={() => navigateTo('ownBookings', 'Own Bookings')}
            />
            <NavButton 
              icon={<WashingMachine className="w-5 h-5" />}
              text="Booking Interface"
              onClick={() => navigateTo('bookingInterface', 'Booking Interface')}
            />
            <NavButton 
              icon={<Clock className="w-5 h-5" />}
              text="Real Time Machine Status"
              onClick={() => navigateTo('machineStatus', 'Machine Status')}
            />
            <NavButton 
              icon={<Bell className="w-5 h-5" />}
              text="Notification Settings"
              onClick={() => navigateTo('notifications', 'Notifications')}
            />
            <NavButton 
              icon={<Settings className="w-5 h-5" />}
              text="Settings"
              onClick={() => navigateTo('settings', 'Settings')}
            />
          </div>
        );

      case 'ownBookings':
        return (
          <div className="space-y-4">
            <NavButton text="Current Bookings" onClick={() => navigateTo('currentBookings', 'Current Bookings')} />
            <NavButton text="Modify Bookings" onClick={() => navigateTo('modifyBookings', 'Modify Bookings')} />
            <NavButton text="Cancel Bookings" onClick={() => navigateTo('cancelBookings', 'Cancel Bookings')} />
          </div>
        );

      case 'bookingInterface':
        return (
          <div className="space-y-4">
            <NavButton text="Book Slots" onClick={() => navigateTo('bookSlots', 'Book Slots')} />
          </div>
        );

      case 'modifyBookings':
        return (
          <div className="space-y-4">
            <NavButton text="Modify Time" onClick={() => navigateTo('modifyTime', 'Modify Time')} />
            <NavButton text="Modify Program" onClick={() => navigateTo('modifyProgram', 'Modify Program')} />
            <NavButton text="Modify Slot Type" onClick={() => navigateTo('modifySlotType', 'Modify Slot Type')} />
          </div>
        );

      case 'machineStatus':
        return (
          <div className="space-y-4">
            <NavButton text="Machine Overview" onClick={() => navigateTo('machineOverview', 'Machine Overview')} />
          </div>
        );

      case 'machineOverview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((machine) => (
                <div key={machine} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Machine {machine}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-green-600">Status: Available</p>
                    <p className="text-sm">Last Used: 2 hours ago</p>
                    <p className="text-sm">Next Booking: None</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <NavButton text="Email / App Settings" onClick={() => navigateTo('notificationSettings', 'Notification Settings')} />
            <NavButton text="Notification Conditions" onClick={() => navigateTo('notificationConditions', 'Notification Conditions')} />
          </div>
        );

      case 'notificationSettings':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Push Notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>SMS Notifications</span>
              </label>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Save Preferences
            </button>
          </div>
        );

      case 'notificationConditions':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>When machine is available</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>15 minutes before booking</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>When washing is complete</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>If machine has error</span>
              </label>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Save Conditions
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <NavButton text="Language Settings" onClick={() => navigateTo('languageSettings', 'Language Settings')} />
          </div>
        );

      case 'languageSettings':
        return (
          <div className="space-y-4">
            <select className="w-full p-2 border rounded-lg">
              <option>English</option>
              <option>Deutsch</option>
              <option>Français</option>
              <option>Español</option>
            </select>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Save Language
            </button>
          </div>
        );

      case 'currentBookings':
        return (
          <div className="space-y-4">
            {[1, 2].map((booking) => (
              <div key={booking} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Booking #{booking}</h3>
                <div className="space-y-1">
                  <p className="text-sm">Machine: Machine {booking}</p>
                  <p className="text-sm">Date: Tomorrow, 14:00</p>
                  <p className="text-sm">Program: Normal Wash (60 min)</p>
                  <p className="text-sm text-blue-600">Status: Confirmed</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'cancelBookings':
        return (
          <div className="space-y-4">
            {[1, 2].map((booking) => (
              <div key={booking} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Booking #{booking}</h3>
                <div className="space-y-1">
                  <p className="text-sm">Machine: Machine {booking}</p>
                  <p className="text-sm">Date: Tomorrow, 14:00</p>
                  <p className="text-sm">Program: Normal Wash (60 min)</p>
                  <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="p-4 text-center">
            <h3 className="font-semibold mb-2">Under Construction</h3>
            <p className="text-gray-600">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 min-h-screen">
      {currentPage !== 'login' && (
        <div className="mb-6">
          <div className="text-2xl font-bold mb-2">Laundry Booking System</div>
          <div className="text-sm text-gray-500">
            {breadcrumbs.join(' > ')}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 shadow">
        {renderPage()}
      </div>

      {currentPage !== 'login' && currentPage !== 'main' && (
        <button
          onClick={() => {
            const newBreadcrumbs = breadcrumbs.slice(0, -1);
            const parentPage = getParentPage(newBreadcrumbs);
            setBreadcrumbs(newBreadcrumbs);
            setCurrentPage(parentPage);
          }}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default WireframePrototype;