import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Layout } from '../../ui/layouts/layout';
import { Communities } from '../../ui/pages/communities';
import { Community } from '../../ui/pages/community';
import { Login } from '../../ui/pages/login';
import { NotFound } from '../../ui/pages/not-found';
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { Signup } from '../../ui/pages/signup';
import { ProfilPage } from '../../ui/pages/profilPage';


const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ Layout }>
        <IndexRoute name="index" component={ Communities } />
        <Route name="community" path="/community/:communityName" component={ Community } />
        <Route path="/communityjoin/:communityName" component={ Community }  onEnter={ requireAuth }  />
        <Route name="login" path="/login" component={ Login } />
        <Route name="communities" path="/communities" component={ Communities } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route name="profil" path="/profil" component={ ProfilPage } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
