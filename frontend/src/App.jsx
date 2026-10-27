import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import AdminDashboard  from './pages/Admin/AdminDashboard';
import AuthorDashboard from './pages/Author/AuthorDashboard';
import CreateTicket from "./pages/Author/createticket/createTicket.jsx";
import MyTickets from "./pages/Author/createticket/MyTickets.jsx";
import TicketDetails from "./pages/Author/createticket/TicketDetails.jsx";
import AdminTicketDetails from "./pages/Admin/AdminTicketDetails.jsx";

//routes 
function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<Login/>}/>
      <Route path="/author/dashboard" element={<AuthorDashboard />}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/author/tickets/new' element={<CreateTicket/>}/>
      <Route path="/author/tickets" element={<MyTickets />} />
      <Route path="/author/tickets/:ticketId" element={<TicketDetails />}/>
      <Route path="/admin/tickets/:ticketId"element={<AdminTicketDetails />}/>
    </Routes> 
    </BrowserRouter>
  )
}

export default App
