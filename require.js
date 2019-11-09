/**
 * @license
  BSD 3-Clause License

  Copyright (c) 2019, Kevin Christopher Chacón Campos
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

  3. Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
this.requirementsStack = [];
this.pseudoStack = [];
this.stackValues = [];

function newStack() {
  this.requirementsStack = [];
  this.pseudoStack = [];
  this.stackValues = [];
}

function require(path) {
  // Add the path to the stack to be required when the _begin function is invoked
  this.requirementsStack.push(path);
  // Add object to pseudo stack and return it to maintain the reference
  this.pseudoStack.push({});
  return this.pseudoStack[this.pseudoStack.length-1];
}

function _begin(fn) {
  var prs = [];

  // Iterate through the stack and add the promise to local requirements array
  // The promises will later be invoked chained
  $.each(this.requirementsStack, function(idx, path) {
    var requirement = function() {
      return new Promise(function(resolve, reject) {
        var dfn = function(data) {
          this.stackValues.push(data);
          resolve(data);
        }.bind(this);
        if (path.endsWith('.js')) {
          $.getScript(path).done(dfn).fail(reject);
        } else {
          $.get(path).done(dfn).fail(reject);
        }
      }.bind(this));
    }
    prs.push(requirement);
  }.bind(this));

  // Add the final promise to the local requirements array
  // This function sets the values in the reference (pseudo) stack
  // and invokes the client callback ending the chain
  prs.push(function() {
    return new Promise(function (resolve, reject) {
      $.each(this.stackValues, function(i, v) {
        this.pseudoStack[i].value = v;
      }.bind(this));
  
      fn();
      resolve();
    }.bind(this));
  }.bind(this));

  // Promises are invoked in chain
  prs.reduce(function(p, fn) {
    return p.then(fn);
  }, Promise.resolve());
}