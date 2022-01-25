from django.shortcuts import get_object_or_404, render
from django.http import Http404

# Create your views here.
from django.http import HttpResponse
from .models import Question

from django.template import loader


def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)

def detail(request, question_num):
    question = get_object_or_404(Question, pk=question_num)
    return render(request, 'polls/detail.html', {'question': question})

def results(request, question_num):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_num)

def vote(request, question_num):
    return HttpResponse("You're voting on question %s." % question_num)